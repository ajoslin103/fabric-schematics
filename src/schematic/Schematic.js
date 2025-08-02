/**
 * Schematic.js
 * Custom Fabric.js object for creating schematic diagrams with grid functionality
 */

import { fabric } from '../utils/fabric';
import { SchematicAdapter } from './SchematicAdapter';
import { version } from '../../package.json';

/**
 * Create Schematic class using fabric.util.createClass
 * This avoids _defineProperty issues with Babel transpilation
 */
const Schematic = fabric.util.createClass(fabric.Object, {
  type: 'schematic',
  
  initialize: function(options) {
    options = options || {};
    this.callSuper('initialize', options);
    
    this.width = options.width || 400;
    this.height = options.height || 400;
    this.cellSize = options.cellSize || 40;
    this.lineColor = options.lineColor || 'rgba(0,0,0,0.3)';
    this.showGrid = options.showGrid !== undefined ? options.showGrid : true;
    
    this.fill = 'transparent';
    this.stroke = 'transparent';
    this.strokeWidth = 0;
    this.originX = 'center';
    this.originY = 'center';
    this.lockRotation = true;
    this.hasControls = false;
    this.hasBorders = false;
    this.selectable = false;
    this.hoverCursor = 'default';
    
    this.adapter = new SchematicAdapter(this);
    this.version = version;
  },

  _render: function(ctx) {
    if (!this.showGrid) return;
    
    // Save context state
    ctx.save();
    
    // Translate to object center for fabric coordinate system
    ctx.translate(-this.width/2, -this.height/2);
    
    // Use the adapter to render grid
    this.adapter.render(ctx);
    
    // Restore context state
    ctx.restore();
  },

  getAdjustedCellSize: function() {
    return this.cellSize;
  },

  setCellSize: function(size) {
    if (typeof size === 'number' && size > 0) {
      this.cellSize = size;
      this.dirty = true;
      this.canvas && this.canvas.requestRenderAll();
    }
    return this;
  },

  setGridVisibility: function(visible) {
    this.showGrid = !!visible;
    this.adapter.setGridVisibility(visible);
    this.dirty = true;
    this.canvas && this.canvas.requestRenderAll();
    return this;
  },

  setLineColor: function(color) {
    if (color) {
      this.lineColor = color;
      this.adapter.setLineColor(color);
      this.dirty = true;
      this.canvas && this.canvas.requestRenderAll();
    }
    return this;
  },

  /**
   * Returns object representation of the schematic
   * @returns {Object} Object representation
   */
  toObject: function() {
    const baseObject = fabric.Object.prototype.toObject.call(this);
    return {
      ...baseObject,
      cellSize: this.cellSize,
      lineColor: this.lineColor,
      showGrid: this.showGrid
    };
  },

  fromObject: function(object, callback) {
    return new Schematic(object);
  }
});

// Register the Schematic class with fabric
fabric.Schematic = Schematic;
fabric.Schematic.fromObject = Schematic.fromObject;

// Export the Schematic class
export { Schematic };

export default Schematic;
