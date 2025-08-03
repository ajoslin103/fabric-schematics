import { clamp } from '../lib/mumath/index';
import { FabricLayersPoint } from '../geometry/Point';
import { MAP, Modes } from '../core/Constants';
import Grid from '../grid/Grid';

/**
 * Schematic object implementation for fabric.js
 * Acts as a view controller managing a Grid instance within Fabric.js lifecycle
 */
fabric.Schematic = fabric.util.createClass(fabric.Object, {
  type: 'schematic',

  /**
   * Constructor for the Schematic object
   * @param {Object} options - Options object
   */
  initialize: function(options) {
    options = options || {};
    this.callSuper('initialize', options);

    // Default properties from MAP constants
    this.defaults = Object.assign({}, MAP);
    Object.assign(this, this.defaults);

    // Set custom defaults
    this.originPin = 'NONE';
    this.pinMargin = 10;
    this.zoomOverMouse = true;
    this.center = new FabricLayersPoint(this.center || { x: 0, y: 0 });
    
    // Override with provided options
    Object.assign(this, options);

    // Set initial mode
    this.mode = this.mode || Modes.GRAB;
    
    // Set initial zoom
    this.zoom = this.zoom || 1;
    
    // Initialize transformation values
    this.dx = 0;
    this.dy = 0;
    
    // Initialize grid using existing Grid class
    this._initializeGrid();
    
    // Set initial position and dimensions
    this.setCoords();
  },

  /**
   * Initialize grid using the existing Grid class with Fabric.js canvas
   * @private
   */
  _initializeGrid: function() {
    // We'll set up the grid once the Schematic is added to a canvas
    this.grid = null;
    this._gridInitialized = false;
  },
  
  /**
   * Initialize grid with Fabric.js canvas (called when added to canvas)
   * @private
   */
  _setupGridWithFabricCanvas: function() {
    if (this._gridInitialized || !this.canvas) return;
    
    // Get the underlying HTML canvas element from Fabric.js canvas
    const fabricCanvasElement = this.canvas.getElement();
    
    // Create Grid instance with Fabric.js canvas element
    this.grid = new Grid(fabricCanvasElement, this);
    
    // Set grid properties from schematic settings
    this.grid.setOriginPin(this.originPin);
    this.grid.setPinMargin(this.pinMargin);
    this.grid.setZoomOverMouse(this.zoomOverMouse);
    
    this._gridInitialized = true;
    
    console.log('Grid initialized with Fabric.js canvas:', {
      fabricCanvas: this.canvas,
      htmlCanvas: fabricCanvasElement,
      canvasWidth: fabricCanvasElement.width,
      canvasHeight: fabricCanvasElement.height
    });
  },
  
  /**
   * Update grid state for current view
   * @private
   */
  _updateGrid: function() {
    // Ensure grid is initialized with Fabric.js canvas
    this._setupGridWithFabricCanvas();
    
    if (!this.grid) return;
    
    // Update grid with current center and zoom
    this.grid.update2({
      x: this.center.x,
      y: this.center.y,
      zoom: this.zoom
    });
    
    console.log('Grid updated with state:', {
      center: this.center,
      zoom: this.zoom,
      gridCanvas: this.grid.canvas,
      gridCanvasSize: { width: this.grid.canvas.width, height: this.grid.canvas.height }
    });
  },
  
  /**
   * Main rendering function - let Grid draw directly to its Fabric.js canvas
   * @param {CanvasRenderingContext2D} ctx - The canvas context to render to
   * @private
   */
  _render: function(ctx) {
    if (!this.showGrid) return;
    
    // Update grid state
    this._updateGrid();
    
    if (!this.grid) return;
    
    console.log('Schematic _render called, letting Grid draw to Fabric.js canvas');
    
    // Let Grid draw directly to its canvas (which is the Fabric.js canvas)
    // This will show us exactly what assumptions Grid makes
    this.grid.draw();
    
    // Note: We're not doing any context manipulation here
    // The Grid will draw directly to the Fabric.js canvas and we'll see what happens
  },
  
  /**
   * Set the zoom level
   * @param {number} zoom - The zoom level to set
   */
  setZoom: function(zoom) {
    this.zoom = clamp(zoom, this.minZoom || 0.1, this.maxZoom || 10);
    this.dx = 0;
    this.dy = 0;
    
    // Trigger re-render using Fabric.js methods
    this.canvas && this.canvas.requestRenderAll();
  },
  
  /**
   * Get the bounds of the schematic
   * @returns {Array} - Array of points representing the bounds
   */
  getBounds: function() {
    const width = this.width || 500;
    const height = this.height || 500;
    
    return [
      new FabricLayersPoint(-width/2, -height/2),
      new FabricLayersPoint(width/2, height/2)
    ];
  },
  
  /**
   * Fit the schematic bounds
   * @param {number} padding - Padding around the bounds
   */
  fitBounds: function(padding = 100) {
    const bounds = this.getBounds();
    
    this.center.x = (bounds[0].x + bounds[1].x) / 2.0;
    this.center.y = -(bounds[0].y + bounds[1].y) / 2.0;

    const boundWidth = Math.abs(bounds[0].x - bounds[1].x) + padding;
    const boundHeight = Math.abs(bounds[0].y - bounds[1].y) + padding;
    
    // Calculate optimal zoom to fit
    const zoomX = (this.width || 500) / boundWidth;
    const zoomY = (this.height || 500) / boundHeight;
    const zoom = Math.min(zoomX, zoomY);
    
    this.setZoom(zoom);
    this.canvas && this.canvas.requestRenderAll();
  },
  
  /**
   * Set the cursor style
   * @param {string} cursor - CSS cursor value
   */
  setCursor: function(cursor) {
    if (!this.canvas) return;
    this.canvas.defaultCursor = cursor;
    this.canvas.hoverCursor = cursor;
  },
  
  /**
   * Reset the schematic to its default state
   */
  reset: function() {
    Object.assign(this, this.defaults);
    this.center = new FabricLayersPoint(this.center || { x: 0, y: 0 });
    
    this.canvas && this.canvas.requestRenderAll();
  },
  
  /**
   * Handle resize events
   * @param {number} width - New width
   * @param {number} height - New height
   */
  onResize: function(width, height) {
    this.width = width || this.width || 500;
    this.height = height || this.height || 500;
    
    // Update grid size if it exists
    if (this.grid) {
      console.log('Resizing grid to:', { width: this.width, height: this.height });
      this.grid.setSize(this.width, this.height);
    }
    
    this.canvas && this.canvas.requestRenderAll();
  },
  
  /**
   * Handle pan and zoom interactions
   * @param {Object} e - Event object with dx, dy, dz properties
   */
  panzoom: function(e) {
    const width = this.width || 500;
    const height = this.height || 500;
    const zoom = clamp(-e.dz, -height * 0.75, height * 0.75) / height;

    const prevZoom = 1 / this.zoom;
    let curZoom = prevZoom * (1 - zoom);
    curZoom = clamp(curZoom, this.minZoom || 0.1, this.maxZoom || 10);

    let { x, y } = this.center;

    // Handle panning
    if (this.isGrabMode() || e.isRight) {
      x -= prevZoom * e.dx;
      y += prevZoom * e.dy;
      this.setCursor('grab');
    } else {
      this.setCursor('pointer');
    }

    // Handle zooming
    if (this.zoomEnabled !== false) {
      let tx = 0, ty = 0;
      if (this.zoomOverMouse) {
        tx = e.x / width - 0.5;
        ty = 0.5 - e.y / height;
      }
      x -= width * (curZoom - prevZoom) * tx;
      y -= height * (curZoom - prevZoom) * ty;
    }

    this.center.setX(x);
    this.center.setY(y);
    this.zoom = 1 / curZoom;
    this.dx = e.dx;
    this.dy = e.dy;

    this.canvas && this.canvas.requestRenderAll();
  },
  
  /**
   * Set the view position
   * @param {Object} view - View object with x, y coordinates
   */
  setView: function(view) {
    this.dx = 0;
    this.dy = 0;
    
    // Copy values from view
    view.y *= -1;
    this.center.copy(view);
    
    this.canvas && this.canvas.requestRenderAll();
  },
  
  /**
   * Set the origin pin location
   * @param {string} corner - Corner identifier
   */
  setOriginPin: function(corner) {
    this.originPin = corner;
    if (this.grid) {
      this.grid.setOriginPin(corner);
    }
  },
  
  /**
   * Set the pin margin
   * @param {number} margin - Margin value
   */
  setPinMargin: function(margin) {
    this.pinMargin = margin;
    if (this.grid) {
      this.grid.setPinMargin(margin);
    }
  },
  
  /**
   * Set whether zoom follows mouse position
   * @param {boolean} followMouse - Whether to follow mouse
   */
  setZoomOverMouse: function(followMouse) {
    this.zoomOverMouse = followMouse;
    if (this.grid) {
      this.grid.setZoomOverMouse(followMouse);
    }
  },
  
  /**
   * Check if in grab mode
   * @returns {boolean} - Whether in grab mode
   */
  isGrabMode: function() {
    return this.mode === Modes.GRAB;
  },
  
  /**
   * Set the current mode
   * @param {string} mode - Mode to set
   */
  setMode: function(mode) {
    this.mode = mode;
  }
});

// Add fromObject function to enable deserialization
fabric.Schematic.fromObject = function(object, callback) {
  return fabric.Object._fromObject('Schematic', object, callback);
};

export default fabric.Schematic;
