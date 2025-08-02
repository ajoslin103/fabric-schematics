import { clamp } from '../lib/mumath/index';
import Grid from '../grid/Grid';
import { FabricLayersPoint } from '../geometry/Point';
import { MAP, Modes } from '../core/Constants';

/**
 * Schematic object implementation for fabric.js
 * Converted from the original Map.js class
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
    this.center = new FabricLayersPoint(this.center);
    
    // Override with provided options
    Object.assign(this, options);

    // Set initial position and dimensions
    this.setCoords();
    
    // Setup grid
    if (this.showGrid) {
      this._setupGrid();
    }
    
    // Set initial mode
    this.mode = this.mode || Modes.GRAB;
    
    // Set initial zoom
    this.zoom = this.zoom || 1;
    
    // Initialize transformation values
    this.dx = 0;
    this.dy = 0;
    
    // Create event handlers bound to this instance
    this._onResize = this.onResize.bind(this);
    
    // Register event listeners
    this.registerListeners();
  },

  /**
   * Set up the grid for this schematic
   * @private
   */
  _setupGrid: function() {
    // Create an offscreen canvas for the grid
    const canvas = document.createElement('canvas');
    canvas.width = this.width || 500;
    canvas.height = this.height || 500;
    
    this.gridCanvas = canvas;
    this.gridCanvas.setAttribute('id', 'fabric-schematics-grid-canvas');
    this.grid = new Grid(this.gridCanvas, this);
    
    // Set grid properties from schematic settings
    this.grid.setOriginPin(this.originPin);
    this.grid.setPinMargin(this.pinMargin);
    this.grid.setZoomOverMouse(this.zoomOverMouse);
    
    this.grid.draw();
  },
  
  /**
   * Main rendering function for the schematic
   * @param {CanvasRenderingContext2D} ctx - The canvas context to render to
   * @private
   */
  _render: function(ctx) {
    // Save current context state
    ctx.save();
    
    // Render the base object (border, background, etc.)
    this.callSuper('_render', ctx);
    
    // Update grid if it exists
    if (this.grid) {
      this.grid.update2({
        x: this.center.x,
        y: this.center.y,
        zoom: this.zoom
      });
      
      // Draw the grid onto the main context
      ctx.drawImage(this.gridCanvas, -this.width/2, -this.height/2, this.width, this.height);
    }
    
    // Restore context state
    ctx.restore();
  },
  
  /**
   * Set the zoom level
   * @param {number} zoom - The zoom level to set
   */
  setZoom: function(zoom) {
    this.zoom = clamp(zoom, this.minZoom, this.maxZoom);
    this.dx = 0;
    this.dy = 0;
    
    // Trigger an update and re-render
    this.update();
    this.canvas && this.canvas.requestRenderAll();
  },
  
  /**
   * Get the bounds of all objects within the schematic
   * @returns {Array} - Array of points representing the bounds
   */
  getBounds: function() {
    if (!this.canvas) return [
      new FabricLayersPoint(0, 0),
      new FabricLayersPoint(this.width, this.height)
    ];
    
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    this.canvas.forEachObject(obj => {
      if (obj === this) return; // Skip self
      
      const coords = obj.getBoundingRect();
      
      minX = Math.min(minX, coords.left);
      maxX = Math.max(maxX, coords.left + coords.width);
      minY = Math.min(minY, coords.top);
      maxY = Math.max(maxY, coords.top + coords.height);
    });

    // If no objects found, use self dimensions
    if (minX === Infinity) {
      minX = -this.width/2;
      maxX = this.width/2;
      minY = -this.height/2;
      maxY = this.height/2;
    }

    return [
      new FabricLayersPoint(minX, minY),
      new FabricLayersPoint(maxX, maxY)
    ];
  },
  
  /**
   * Fit the schematic bounds to contain all objects
   * @param {number} padding - Padding around the bounds
   */
  fitBounds: function(padding = 100) {
    if (!this.canvas) return;
    
    const bounds = this.getBounds();
    
    this.center.x = (bounds[0].x + bounds[1].x) / 2.0;
    this.center.y = -(bounds[0].y + bounds[1].y) / 2.0;

    const boundWidth = Math.abs(bounds[0].x - bounds[1].x) + padding;
    const boundHeight = Math.abs(bounds[0].y - bounds[1].y) + padding;
    
    // Calculate optimal zoom to fit
    const zoomX = this.width / boundWidth;
    const zoomY = this.height / boundHeight;
    const zoom = Math.min(zoomX, zoomY);
    
    this.setZoom(zoom);
    this.update();
    
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
    this.center = new FabricLayersPoint(this.center);
    
    this.update();
    this.canvas && this.canvas.requestRenderAll();
  },
  
  /**
   * Handle resize events
   * @param {number} width - New width
   * @param {number} height - New height
   */
  onResize: function(width, height) {
    if (!width || !height) {
      width = this.canvas ? this.canvas.getWidth() : 500;
      height = this.canvas ? this.canvas.getHeight() : 500;
    }
    
    this.width = width;
    this.height = height;
    
    if (this.grid) {
      this.grid.setSize(width, height);
    }
    
    this.update();
  },
  
  /**
   * Update the schematic state
   */
  update: function() {
    if (this.grid) {
      this.grid.update2({
        x: this.center.x,
        y: this.center.y,
        zoom: this.zoom
      });
      
      this.grid.render();
    }
    
    this.fire('update', this);
    
    // Set cursor based on mode
    if (this.isGrabMode() || this.isRight) {
      this.setCursor('grab');
    } else {
      this.setCursor('pointer');
    }
    
    this.canvas && this.canvas.requestRenderAll();
  },
  
  /**
   * Handle pan and zoom interactions
   * @param {Object} e - Event object with dx, dy, dz properties
   */
  panzoom: function(e) {
    const { width, height } = { width: this.width, height: this.height };
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
      this.setCursor('grab');
    } else {
      this.setCursor('pointer');
    }

    if (this.zoomEnabled) {
      let tx, ty;
      if (this.grid && this.grid.zoomOverMouse) {
        // Zoom centered on mouse position
        tx = e.x / width - oX;
        ty = oY - e.y / height;
      } else {
        // Zoom centered on viewport center
        tx = 0;
        ty = 0;
      }
      x -= width * (curZoom - prevZoom) * tx;
      y -= height * (curZoom - prevZoom) * ty;
    }

    this.center.setX(x);
    this.center.setY(y);
    this.zoom = 1 / curZoom;
    this.dx = e.dx;
    this.dy = e.dy;
    this.x = e.x0;
    this.y = e.y0;
    this.isRight = e.isRight;

    this.update();
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
    
    this.update();
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
   * Register event listeners
   */
  registerListeners: function() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this._onResize);
    }
  },
  
  /**
   * Unregister event listeners
   */
  unregisterListeners: function() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this._onResize);
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
  },
  
  /**
   * Clean up resources when removing this object
   */
  dispose: function() {
    this.unregisterListeners();
    this.callSuper('dispose');
  }
});

// Add fromObject function to enable deserialization
fabric.Schematic.fromObject = function(object, callback) {
  return fabric.Object._fromObject('Schematic', object, callback);
};

export default fabric.Schematic;
