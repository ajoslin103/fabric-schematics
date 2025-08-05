import panzoom from '../lib/panzoom'; // a smooth customer

import Base from '../core/Base';
import Grid from '../grid/Grid';
import { Point } from '../geometry/Point';
import MapState from './MapState';

import createEventSpy from '../utils/event-spy';
const enableEventSpy = createEventSpy();

export class Map extends Base {
  constructor(container, options) {
    super(options);

    enableEventSpy('map', this);
    
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
    
    // Listen for state changes
    this.state.on('change', ({ newState }) => {
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
    this.grid = new Grid(this.canvas, this);
    
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
    this.state.setZoom(zoom);
    this.state.setDeltas(0, 0);
    this.state.setCoordinates(this.canvas.width / 2.0, this.canvas.height / 2.0);
    
    // Double update for immediate visual feedback
    setTimeout(() => {
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

    this.canvas.width = width;
    this.canvas.height = height;

    if (this.grid) {
      this.grid.setSize(width, height);
    }

    // Update state with new dimensions
    this.state.setDimensions(width, height);
  }

  update() {
    if (this.grid) {
      this.grid.update2(this.state.getGridUpdateState());
    }

    this.emit('update', this);
    
    if (this.grid) {
      this.grid.render();
    }

    if (this.state.isGrabMode() || this.state.isRight) {
      this.emit('panning');
      this.setCursor('grab');
    } else {
      this.setCursor('pointer');
    }

    const now = Date.now();
    if (this.state.lastUpdatedTime && Math.abs(this.state.lastUpdatedTime - now) < 100) {
      return;
    }
    this.state.updateTimestamp();
  }

  panzoom(e) {
    // Update state using the panzoom event
    this.state.processPanzoom(e);
    
    // Update cursor based on interaction mode
    if (this.state.isGrabMode() || e.isRight) {
      this.setCursor('grab');
    } else {
      this.setCursor('pointer');
    }
  }

  setView(view) {
    this.state.setDeltas(0, 0);
    this.state.setCoordinates(0, 0);
    
    // Flip Y coordinate to match the expected coordinate system
    const flippedView = new Point(view.x, -view.y);
    this.state.center.copy(flippedView);
    
    // Double update for immediate visual feedback
    setTimeout(() => {
      this.update();
    }, 0);
  }

  setOriginPin(corner) {
    this.state.setOriginPin(corner);
    if (this.grid) {  
      this.grid.setOriginPin(corner);
    }
  }

  setPinMargin(margin) {
    this.state.setPinMargin(margin);
    if (this.grid) {
      this.grid.setPinMargin(margin);
    }
  }

  setZoomOverMouse(followMouse) {
    this.state.setZoomOverMouse(followMouse);
    if (this.grid) {
      this.grid.setZoomOverMouse(followMouse);
    }
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
