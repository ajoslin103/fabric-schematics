import panzoom from '../lib/panzoom'; // a smooth customer

import Base from '../core/Base';
import Grid from '../grid/Grid';
import { Point } from '../geometry/Point';
import MapState from './MapState';
import { DEBUG } from '../utils/debug';
import createEventSpy from '../utils/event-spy';
const enableEventSpy = createEventSpy();

export class Map extends Base {
  constructor(container, options) {
    super(options);

    DEBUG.EVENTS.EMITTER && enableEventSpy('map', this);
    
    // Initialize container and canvas
    this.container = container || document.body;
    this.canvas = document.createElement('canvas');
    this.container.appendChild(this.canvas);
    this.canvas.setAttribute('id', 'schematics-canvas');
    
    const width = options?.width || this.container.clientWidth;
    const height = options?.height || this.container.clientHeight;
    this.canvas.width = width;
    this.canvas.height = height;

    // Initialize state with canvas dimensions and options
    const stateOptions = { ...options, width, height };
    this.state = new MapState(stateOptions);
    
    // For backward compatibility, mirror important properties directly on this object
    // This avoids the need for getters/setters which can cause timing issues
    this.center = this.state.center;
    this.zoom = this.state.zoom;
    this.minZoom = this.state.minZoom;
    this.maxZoom = this.state.maxZoom;
    this.originPin = this.state.originPin;
    this.pinMargin = this.state.pinMargin;
    this.zoomOverMouse = this.state.zoomOverMouse;
    this.zoomEnabled = this.state.zoomEnabled;
    this.originX = this.state.originX;
    this.originY = this.state.originY;
    this.dx = this.state.dx;
    this.dy = this.state.dy;
    this.x = this.state.x;
    this.y = this.state.y;
    this.isRight = this.state.isRight;
    this.lastUpdatedTime = this.state.lastUpdatedTime;
    this.mode = this.state.mode;
    
    // Listen for state changes
    this.state.on('change', ({ prevState, newState }) => {
      const eventType = arguments[0]?.type || 'general';
      DEBUG.MAP.GENERAL && console.log('[MAP:STATE_CHANGE] Type:', eventType);
      
      // Update mirrored properties
      this.center = this.state.center;
      this.zoom = this.state.zoom;
      this.minZoom = this.state.minZoom;
      this.maxZoom = this.state.maxZoom;
      this.originX = this.state.originX;
      this.originY = this.state.originY;
      this.dx = this.state.dx;
      this.dy = this.state.dy;
      this.x = this.state.x;
      this.y = this.state.y;
      this.isRight = this.state.isRight;
      this.lastUpdatedTime = this.state.lastUpdatedTime;
      this.mode = this.state.mode;
      
      DEBUG.MAP.MIRRORING && console.log('[MAP:MIRRORED_PROPS] Updated properties from state', {
        zoom: this.zoom,
        minZoom: this.minZoom,
        maxZoom: this.maxZoom
      });
      
      this.update();
    });
    
    // Setup panzoom
    const vm = this;
    panzoom(this.container, e => {
      vm.panzoom(e);
    });

    this.registerListeners();

    setTimeout(() => {
      this.emit('ready', this);
    }, 300);
  }

  addGrid() {
    // Create a compatible adapter for Grid
    // The Grid expects specific properties directly on the object
    const gridAdapter = {
      canvas: this.canvas,
      center: this.state.center,
      zoom: this.state.zoom,
      originPin: this.state.originPin,
      pinMargin: this.state.pinMargin,
      zoomOverMouse: this.state.zoomOverMouse,
      zoomEnabled: this.state.zoomEnabled
    };
    
    this.grid = new Grid(this.canvas, gridAdapter);
    
    // Set grid properties from state
    this.grid.setOriginPin(this.state.originPin);
    this.grid.setPinMargin(this.state.pinMargin);
    this.grid.setZoomOverMouse(this.state.zoomOverMouse);
    
    this.grid.draw();
  }

  // cloneCanvas() {
  //   const clone = document.createElement('canvas');
  //   clone.width = this.canvas.width;
  //   clone.height = this.canvas.height;
    
  //   // Add absolute positioning to ensure proper overlay
  //   clone.style.position = 'absolute';
  //   clone.style.top = '0';
  //   clone.style.left = '0';
    
  //   // Insert into container
  //   this.container.appendChild(clone);
  //   return clone;
  // }

  setZoom(zoom) {
    DEBUG.MAP.PANZOOM && console.log('[MAP:SET_ZOOM] Called with zoom level', zoom);
    
    // Ensure zoom is within min/max range
    const clampedZoom = Math.max(this.minZoom, Math.min(zoom, this.maxZoom));
    this.zoom = clampedZoom;
    this.state.setZoom(clampedZoom);
    
    this.dx = 0;
    this.dy = 0;
    this.state.setDeltas(0, 0);
    
    this.x = this.canvas.width / 2.0;
    this.y = this.canvas.height / 2.0;
    this.state.setCoordinates(this.canvas.width / 2.0, this.canvas.height / 2.0);
    
    // Double update for immediate visual feedback
    setTimeout(() => {
      DEBUG.MAP.PANZOOM && console.log('[MAP:SET_ZOOM] Triggering immediate update');
      this.update();
    }, 0);
  }

  getBounds() {
    // Return bounds from state
    return this.state.getBounds();
  }

  fitBounds(padding = 100) {
    this.onResize();
    
    // Note: this method seems to have a reference to this.fabric which doesn't exist
    // in the original code. For now, we'll just use the canvas dimensions
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    this.state.setOrigin(-width / 2, -height / 2);
    
    // Double update for immediate visual feedback
    setTimeout(() => {
      this.update();
    }, 0);
  }

  setCursor(cursor) {
    this.container.style.cursor = cursor;
  }

  reset() {
    this.onResize();
    this.state.resetView();
    
    // Double update for immediate visual feedback
    setTimeout(() => {
      this.update();
    }, 0);
  }

  onResize(width, height) {
    width = width || this.container.clientWidth;
    height = height || this.container.clientHeight;
    
    DEBUG.MAP.DIMENSIONS && console.log('[MAP:RESIZE] Resizing to', {width, height});

    this.canvas.width = width;
    this.canvas.height = height;

    if (this.grid) {
      this.grid.setSize(width, height);
    }

    // Update state with new dimensions
    this.state.setDimensions(width, height);
    DEBUG.MAP.DIMENSIONS && console.log('[MAP:RESIZE] Canvas and state dimensions updated');
  }

  update() {
    DEBUG.MAP.RENDER && console.log('[MAP:UPDATE] Starting map update');
    
    if (this.grid) {
      // Ensure Grid has access to the latest state values it needs
      this.grid.center = this.center;
      this.grid.zoom = this.zoom;
      this.grid.zoomEnabled = this.zoomEnabled;
      
      // Update the grid with current state
      DEBUG.MAP.RENDER && console.log('[MAP:UPDATE] Updating grid with', {
        x: this.center.x,
        y: this.center.y,
        zoom: this.zoom
      });
      
      this.grid.update2({
        x: this.center.x,
        y: this.center.y,
        zoom: this.zoom
      });
    }

    this.emit('update', this);
    
    if (this.grid) {
      this.grid.render();
    }

    if (this.isGrabMode() || this.isRight) {
      this.emit('panning');
      this.setCursor('grab');
      DEBUG.MAP.GENERAL && console.log('[MAP:UPDATE] In grab mode or right mouse button pressed');
    } else {
      this.setCursor('pointer');
    }

    const now = Date.now();
    if (this.lastUpdatedTime && Math.abs(this.lastUpdatedTime - now) < 100) {
      DEBUG.MAP.TIMESTAMP && console.log('[MAP:UPDATE] Skipping timestamp update - too soon');
      return;
    }
    this.lastUpdatedTime = now;
    this.state.updateTimestamp();
    DEBUG.MAP.RENDER && console.log('[MAP:UPDATE] Update completed');
  }

  panzoom(e) {
    DEBUG.MAP.PANZOOM && console.log('[MAP:PANZOOM] Processing panzoom event', {
      dx: e.dx,
      dy: e.dy,
      dz: e.dz,
      x: e.x,
      y: e.y,
      isRight: e.isRight
    });
    
    // Update state using the panzoom event
    this.state.processPanzoom(e);
    
    // Update mirrored properties
    this.center = this.state.center;
    this.zoom = this.state.zoom;
    this.dx = this.state.dx;
    this.dy = this.state.dy;
    this.x = this.state.x;
    this.y = this.state.y;
    this.isRight = this.state.isRight;
    
    DEBUG.MAP.PANZOOM && console.log('[MAP:PANZOOM] Updated map properties from state', {
      center: {x: this.center.x, y: this.center.y},
      zoom: this.zoom
    });
    
    // Update cursor based on interaction mode
    if (this.isGrabMode() || e.isRight) {
      this.setCursor('grab');
    } else {
      this.setCursor('pointer');
    }
  }

  setView(view) {
    DEBUG.MAP.GENERAL && console.log('[MAP:SET_VIEW] Called with view', view);
    
    // Update state
    this.state.setDeltas(0, 0);
    this.state.setCoordinates(0, 0);
    
    // Flip Y coordinate to match the expected coordinate system
    const flippedView = new Point(view.x, -view.y);
    DEBUG.MAP.GENERAL && console.log('[MAP:SET_VIEW] Flipped Y coordinate', flippedView);
    
    this.state.center.copy(flippedView);
    
    // Update mirrored properties
    this.dx = 0;
    this.dy = 0;
    this.x = 0;
    this.y = 0;
    this.center = this.state.center;
    
    // Double update for immediate visual feedback
    setTimeout(() => {
      DEBUG.MAP.GENERAL && console.log('[MAP:SET_VIEW] Triggering immediate update');
      this.update();
    }, 0);
  }

  setOriginPin(corner) {
    this.originPin = corner;
    this.state.setOriginPin(corner);
    if (this.grid) {  
      this.grid.setOriginPin(corner);
    }
  }

  setPinMargin(margin) {
    this.pinMargin = margin;
    this.state.setPinMargin(margin);
    if (this.grid) {
      this.grid.setPinMargin(margin);
    }
  }

  setZoomOverMouse(followMouse) {
    this.zoomOverMouse = followMouse;
    this.state.setZoomOverMouse(followMouse);
    if (this.grid) {
      this.grid.setZoomOverMouse(followMouse);
    }
  }
  
  // Set minimum zoom level
  setMinZoom(minZoom) {
    // Update Map's minZoom property
    this.minZoom = minZoom;
    
    // Update state's minZoom (which will emit events and adjust zoom if needed)
    this.state.setMinZoom(minZoom);
    
    DEBUG.MAP.PANZOOM && console.log('[MAP:MIN_ZOOM] Set to', minZoom);
    return this;
  }
  
  // Set maximum zoom level
  setMaxZoom(maxZoom) {
    // Update Map's maxZoom property
    this.maxZoom = maxZoom;
    
    // Update state's maxZoom (which will emit events and adjust zoom if needed)
    this.state.setMaxZoom(maxZoom);
    
    DEBUG.MAP.PANZOOM && console.log('[MAP:MAX_ZOOM] Set to', maxZoom);
    return this;
  }

  registerListeners() {
    const vm = this;

    // Only keep the window resize handler - removed all layer-related event handlers
    window.addEventListener('resize', () => {
      vm.onResize();
    });
  }

  unregisterListeners() {
    // No fabric events to unregister
  }
  
  // Mode-related methods
  setMode(mode) {
    this.mode = mode;
    this.state.setMode(mode);
  }
  
  setModeAsSelect() {
    this.state.setModeAsSelect();
  }
  
  setModeAsGrab() {
    this.state.setModeAsGrab();
  }
  
  isSelectMode() {
    return this.state.isSelectMode();
  }
  
  isGrabMode() {
    return this.state.isGrabMode();
  }

  // Marker functionality removed (not used in grid demo)
}

export default Map;
