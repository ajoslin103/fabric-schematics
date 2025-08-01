/**
 * Schematic.js
 * Custom Fabric.js object for creating schematic diagrams with grid functionality
 */

import { fabric } from '../utils/fabric';
import { SchematicAdapter } from './SchematicAdapter';
import { version } from '../../package.json';

/**
 * Schematic object for fabric.js
 * @class Schematic
 * @extends {fabric.Object}
 */
export class Schematic extends fabric.Object {
  /**
   * Type of object
   * @type {String}
   * @default
   */
  static type = 'schematic';

  /**
   * Constructor for Schematic object
   * @param {Object} [options] Options object
   * @param {Number} [options.width=400] Width of the schematic
   * @param {Number} [options.height=400] Height of the schematic
   * @param {Number} [options.cellSize=40] Base cell size in pixels
   * @param {String} [options.lineColor='rgba(0,0,0,0.3)'] Line color with alpha
   * @param {Boolean} [options.showGrid=true] Whether to show the grid
   */
  constructor(options = {}) {
    // Set defaults and call super
    const defaults = {
      width: 400,
      height: 400,
      fill: 'transparent',
      stroke: 'transparent',
      strokeWidth: 0,
      originX: 'center',
      originY: 'center',
      lockRotation: true,
      hasControls: false,
      hasBorders: false,
      selectable: false,
      hoverCursor: 'default',
      cellSize: 40,
      lineColor: 'rgba(0,0,0,0.3)',
      showGrid: true
    };

    super({...defaults, ...options});

    // Initialize the adapter
    this.adapter = new SchematicAdapter(this);
    
    // Set version
    this.version = version;
    
    // Initialize the schematic
    this._initializeSchematic();
  }

  /**
   * Initialize the schematic
   * @private
   */
  _initializeSchematic() {
    // Additional initialization code here
  }

  /**
   * Renders the schematic on the canvas
   * @param {CanvasRenderingContext2D} ctx Context to render on
   * @private
   */
  _render(ctx) {
    if (!this.showGrid) return;

    // Save the context state
    ctx.save();

    // Draw the grid via adapter
    this.adapter.drawGrid(ctx);

    // Restore context state
    ctx.restore();
  }

  /**
   * Get the cell size adjusted for zoom
   * @returns {Number} Adjusted cell size
   */
  getAdjustedCellSize() {
    return this.cellSize;
  }

  /**
   * Set cell size with validation
   * @param {Number} size New cell size
   * @returns {Schematic} this instance for chaining
   */
  setCellSize(size) {
    if (typeof size === 'number' && size > 0) {
      this.cellSize = size;
      this.dirty = true;
      this.canvas && this.canvas.requestRenderAll();
    }
    return this;
  }

  /**
   * Toggle grid visibility
   * @param {Boolean} visible Whether the grid should be visible
   * @returns {Schematic} this instance for chaining
   */
  setGridVisibility(visible) {
    this.showGrid = !!visible;
    this.dirty = true;
    this.canvas && this.canvas.requestRenderAll();
    return this;
  }

  /**
   * Set grid line color
   * @param {String} color CSS color string
   * @returns {Schematic} this instance for chaining
   */
  setLineColor(color) {
    if (color) {
      this.lineColor = color;
      this.dirty = true;
      this.canvas && this.canvas.requestRenderAll();
    }
    return this;
  }

  /**
   * Returns object representation of the schematic
   * @returns {Object} Object representation
   */
  toObject() {
    return {
      ...super.toObject(),
      cellSize: this.cellSize,
      lineColor: this.lineColor,
      showGrid: this.showGrid
    };
  }

  /**
   * Creates an instance of Schematic from an object
   * @static
   * @param {Object} object Object to create an instance from
   * @param {Function} [callback] Callback to invoke when the instance is created
   */
  static fromObject(object, callback) {
    return new Schematic(object);
  }
}

// Register the Schematic class with fabric
fabric.Schematic = Schematic;
fabric.Schematic.fromObject = Schematic.fromObject;
