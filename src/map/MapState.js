import EventEmitter2 from 'eventemitter2';
import { Point } from '../geometry/Point';
import { MAP, Modes, OriginPin } from '../core/Constants';
import { clamp } from '../lib/mumath/index';
import { DEBUG } from '../utils/debug';

class MapState extends EventEmitter2 {
  constructor(options = {}) {
    super();
    
    // Initialize with defaults merged with options
    this._initializeState(options);
  }
  
  // Initialize state with defaults and options
  _initializeState(options) {
    // Config state
    this.zoom = options.zoom || MAP.zoom;
    this.minZoom = options.minZoom || MAP.minZoom;
    this.maxZoom = options.maxZoom || MAP.maxZoom;
    this.gridEnabled = options.gridEnabled !== undefined ? options.gridEnabled : MAP.gridEnabled;
    this.zoomEnabled = options.zoomEnabled !== undefined ? options.zoomEnabled : MAP.zoomEnabled;
    this.selectEnabled = options.selectEnabled !== undefined ? options.selectEnabled : MAP.selectEnabled;
    this.showGrid = options.showGrid !== undefined ? options.showGrid : MAP.showGrid;
    this.originPin = options.originPin || MAP.originPin;
    this.pinMargin = options.pinMargin !== undefined ? options.pinMargin : 10;
    this.enablePan = options.enablePan !== undefined ? options.enablePan : MAP.enablePan;
    this.mode = options.mode || MAP.mode;
    
    // Viewport state
    this.center = options.center ? new Point(options.center) : new Point(MAP.center);
    this.x = options.x || this.center.x;
    this.y = options.y || this.center.y;
    this.dx = options.dx || 0;
    this.dy = options.dy || 0;
    
    // Canvas dimensions
    this.width = options.width || 0;
    this.height = options.height || 0;
    
    // Derived values
    this.originX = options.originX || -this.width / 2;
    this.originY = options.originY || -this.height / 2;
    
    // Interaction state
    this.isRight = options.isRight || false;
    this.lastUpdatedTime = options.lastUpdatedTime || 0;
  }
  
  // Set zoom level with bounds checking
  setZoom(zoom) {
    const newZoom = clamp(zoom, this.minZoom, this.maxZoom);
    if (newZoom !== this.zoom) {
      const prevState = { ...this };
      this.zoom = newZoom;
      DEBUG.STATE.PANZOOM && console.log('[STATE:ZOOM] Changed from', prevState.zoom, 'to', this.zoom);
      this.emit('change:zoom', { prevState, newState: this });
      this.emit('change', { prevState, newState: this });
    }
    return this;
  }
  
  // Set center point
  setCenter(x, y) {
    if (x !== this.center.x || y !== this.center.y) {
      const prevState = { ...this };
      const prevX = this.center.x;
      const prevY = this.center.y;
      this.center.setX(x);
      this.center.setY(y);
      DEBUG.STATE.POSITION && console.log('[STATE:CENTER] Changed from', {x: prevX, y: prevY}, 'to', {x: this.center.x, y: this.center.y});
      this.emit('change:center', { prevState, newState: this });
      this.emit('change', { prevState, newState: this });
    }
    return this;
  }
  
  // Set x, y coordinates
  setCoordinates(x, y) {
    if (x !== this.x || y !== this.y) {
      const prevState = { ...this };
      const prevX = this.x;
      const prevY = this.y;
      this.x = x;
      this.y = y;
      DEBUG.STATE.POSITION && console.log('[STATE:COORDINATES] Changed from', {x: prevX, y: prevY}, 'to', {x, y});
      this.emit('change:coordinates', { prevState, newState: this });
      this.emit('change', { prevState, newState: this });
    }
    return this;
  }
  
  // Set dimensions
  setDimensions(width, height) {
    if (width !== this.width || height !== this.height) {
      const prevState = { ...this };
      const prevWidth = this.width;
      const prevHeight = this.height;
      this.width = width;
      this.height = height;
      this.originX = -width / 2;
      this.originY = -height / 2;
      DEBUG.STATE.DIMENSIONS && console.log('[STATE:DIMENSIONS] Changed from', {width: prevWidth, height: prevHeight}, 'to', {width, height});
      DEBUG.STATE.DIMENSIONS && console.log('[STATE:ORIGIN] Updated to', {x: this.originX, y: this.originY});
      this.emit('change:dimensions', { prevState, newState: this });
      this.emit('change', { prevState, newState: this });
    }
    return this;
  }
  
  // Set mode (SELECT/GRAB)
  setMode(mode) {
    if (mode !== this.mode) {
      const prevState = { ...this };
      const prevMode = this.mode;
      this.mode = mode;
      DEBUG.STATE.MODE && console.log('[STATE:MODE] Changed from', prevMode, 'to', mode);
      this.emit('change:mode', { prevState, newState: this });
      this.emit('change', { prevState, newState: this });
    }
    return this;
  }
  
  // Helper methods
  setModeAsSelect() {
    return this.setMode(Modes.SELECT);
  }
  
  setModeAsGrab() {
    return this.setMode(Modes.GRAB);
  }
  
  isSelectMode() {
    return this.mode === Modes.SELECT;
  }
  
  isGrabMode() {
    return this.mode === Modes.GRAB;
  }
  
  // Set origin pin corner
  setOriginPin(corner) {
    if (corner !== this.originPin) {
      const prevState = { ...this };
      const prevCorner = this.originPin;
      this.originPin = corner;
      DEBUG.STATE.GENERAL && console.log('[STATE:ORIGIN_PIN] Changed from', prevCorner, 'to', corner);
      this.emit('change:originPin', { prevState, newState: this });
      this.emit('change', { prevState, newState: this });
    }
    return this;
  }
  
  // Set pin margin
  setPinMargin(margin) {
    if (margin !== this.pinMargin) {
      const prevState = { ...this };
      this.pinMargin = margin;
      this.emit('change:pinMargin', { prevState, newState: this });
      this.emit('change', { prevState, newState: this });
    }
    return this;
  }

  // Set minimum zoom level
  setMinZoom(minZoom) {
    if (minZoom !== this.minZoom) {
      const prevState = { ...this };
      const prevMinZoom = this.minZoom;
      this.minZoom = minZoom;
      
      // Ensure zoom stays within bounds
      if (this.zoom < minZoom) {
        this.zoom = minZoom;
      }
      
      DEBUG.STATE.GENERAL && console.log('[STATE:MIN_ZOOM] Changed from', prevMinZoom, 'to', minZoom);
      this.emit('change:minZoom', { prevState, newState: this });
      this.emit('change', { prevState, newState: this });
    }
    return this;
  }
  
  // Set maximum zoom level
  setMaxZoom(maxZoom) {
    if (maxZoom !== this.maxZoom) {
      const prevState = { ...this };
      const prevMaxZoom = this.maxZoom;
      this.maxZoom = maxZoom;
      
      // Ensure zoom stays within bounds
      if (this.zoom > maxZoom) {
        this.zoom = maxZoom;
      }
      
      DEBUG.STATE.GENERAL && console.log('[STATE:MAX_ZOOM] Changed from', prevMaxZoom, 'to', maxZoom);
      this.emit('change:maxZoom', { prevState, newState: this });
      this.emit('change', { prevState, newState: this });
    }
    return this;
  }
  
  
  // Update delta values
  setDeltas(dx, dy) {
    if (dx !== this.dx || dy !== this.dy) {
      const prevState = { ...this };
      const prevDx = this.dx;
      const prevDy = this.dy;
      this.dx = dx;
      this.dy = dy;
      DEBUG.STATE.POSITION && console.log('[STATE:DELTAS] Changed from', {dx: prevDx, dy: prevDy}, 'to', {dx, dy});
      this.emit('change:deltas', { prevState, newState: this });
      this.emit('change', { prevState, newState: this });
    }
    return this;
  }
  
  // Set origin coordinates
  setOrigin(originX, originY) {
    if (originX !== this.originX || originY !== this.originY) {
      const prevState = { ...this };
      this.originX = originX;
      this.originY = originY;
      this.emit('change:origin', { prevState, newState: this });
      this.emit('change', { prevState, newState: this });
    }
    return this;
  }
  
  // Set right mouse button state
  setIsRight(isRight) {
    if (isRight !== this.isRight) {
      const prevState = { ...this };
      this.isRight = isRight;
      this.emit('change:isRight', { prevState, newState: this });
      this.emit('change', { prevState, newState: this });
    }
    return this;
  }
  
  // Update lastUpdatedTime
  updateTimestamp() {
    const prevTime = this.lastUpdatedTime;
    this.lastUpdatedTime = Date.now();
    DEBUG.STATE.TIMING && console.log('[STATE:TIMESTAMP] Updated from', prevTime, 'to', this.lastUpdatedTime);
    return this;
  }
  
  // Process panzoom events
  processPanzoom(e) {
    DEBUG.STATE.PANZOOM && console.log('[STATE:PANZOOM] Processing event', {
      dx: e.dx,
      dy: e.dy,
      dz: e.dz,
      x0: e.x0,
      y0: e.y0,
      isRight: e.isRight
    });
    
    const { width, height } = this;
    const zoom = clamp(-e.dz, -height * 0.75, height * 0.75) / height;

    const prevZoom = 1 / this.zoom;
    let curZoom = prevZoom * (1 - zoom);
    curZoom = clamp(curZoom, this.minZoom, this.maxZoom);

    let { x, y } = this.center;

    // pan
    const oX = 0.5;
    const oY = 0.5;
    if (this.isGrabMode() || e.isRight) {
      x -= prevZoom * e.dx;
      y += prevZoom * e.dy;
    }

    if (this.zoomEnabled) {
      // Always zoom centered on viewport center
      const tx = 0;
      const ty = 0;
      x -= width * (curZoom - prevZoom) * tx;
      y -= height * (curZoom - prevZoom) * ty;
    }

    const prevState = { ...this };
    const prevCenterX = this.center.x;
    const prevCenterY = this.center.y;
    const prevZoomVal = this.zoom;
    
    // Update all related properties at once
    this.center.setX(x);
    this.center.setY(y);
    this.zoom = 1 / curZoom;
    this.dx = e.dx;
    this.dy = e.dy;
    this.x = e.x0;
    this.y = e.y0;
    this.isRight = e.isRight;
    
    DEBUG.STATE.PANZOOM && console.log('[STATE:PANZOOM] State updated', {
      center: { from: {x: prevCenterX, y: prevCenterY}, to: {x: this.center.x, y: this.center.y} },
      zoom: { from: prevZoomVal, to: this.zoom },
      coordinates: { x: this.x, y: this.y },
      deltas: { dx: this.dx, dy: this.dy },
      isRight: this.isRight
    });
    
    this.emit('change:panzoom', { prevState, newState: this });
    this.emit('change', { prevState, newState: this });
    
    return this;
  }
  
  // Get state for Grid updates
  getGridUpdateState() {
    return {
      x: this.center.x,
      y: this.center.y,
      zoom: this.zoom
    };
  }
  
  // Reset to default view
  resetView() {
    const prevState = { ...this };
    
    this.originX = -this.width / 2;
    this.originY = -this.height / 2;
    
    this.emit('change:resetView', { prevState, newState: this });
    this.emit('change', { prevState, newState: this });
    
    return this;
  }
  
  // Get bounds
  getBounds() {
    return [
      new Point(-this.width/2, -this.height/2), 
      new Point(this.width/2, this.height/2)
    ];
  }
  
  // Get state for serialization
  toJSON() {
    return {
      zoom: this.zoom,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      gridEnabled: this.gridEnabled,
      zoomEnabled: this.zoomEnabled,
      selectEnabled: this.selectEnabled,
      showGrid: this.showGrid,
      originPin: this.originPin,
      pinMargin: this.pinMargin,
      enablePan: this.enablePan,
      mode: this.mode,
      center: { x: this.center.x, y: this.center.y },
      width: this.width,
      height: this.height
    };
  }
  
  // Create a state from serialized data
  static fromJSON(json) {
    return new MapState(json);
  }
  
  // Clone state
  clone() {
    return new MapState(this.toJSON());
  }
}

export default MapState;