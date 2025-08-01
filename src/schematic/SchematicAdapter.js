/**
 * SchematicAdapter.js
 * Adapter between Schematic Fabric.js object and grid drawing functionality
 */

import { calcGridCoordinates } from '../utils/gridCalculations';

/**
 * Adapter class to bridge between Fabric.js object model and grid calculations
 */
export class SchematicAdapter {
  /**
   * Constructor
   * @param {Schematic} schematic The parent schematic object
   */
  constructor(schematic) {
    this.schematic = schematic;
    this.gridCache = null;
    this.lastCellSize = null;
    this.lastWidth = null;
    this.lastHeight = null;
  }

  /**
   * Calculate grid coordinates
   * @returns {Object} Grid coordinates
   * @private
   */
  _calculateGridCoordinates() {
    const { width, height, cellSize } = this.schematic;
    
    // Return cached result if dimensions haven't changed
    if (
      this.gridCache && 
      this.lastCellSize === cellSize && 
      this.lastWidth === width && 
      this.lastHeight === height
    ) {
      return this.gridCache;
    }
    
    // Calculate new grid coordinates
    this.gridCache = calcGridCoordinates(width, height, cellSize);
    this.lastCellSize = cellSize;
    this.lastWidth = width;
    this.lastHeight = height;
    
    return this.gridCache;
  }

  /**
   * Draw grid lines on the provided context
   * @param {CanvasRenderingContext2D} ctx Canvas rendering context
   */
  drawGrid(ctx) {
    const { lineColor, width, height } = this.schematic;
    const gridCoords = this._calculateGridCoordinates();
    
    // Set line style
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    
    // Start from the center and adjust for fabric.Object's coordinate system
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    // Draw vertical lines
    gridCoords.xCoords.forEach(x => {
      ctx.beginPath();
      ctx.moveTo(x - halfWidth, -halfHeight);
      ctx.lineTo(x - halfWidth, halfHeight);
      ctx.stroke();
    });
    
    // Draw horizontal lines
    gridCoords.yCoords.forEach(y => {
      ctx.beginPath();
      ctx.moveTo(-halfWidth, y - halfHeight);
      ctx.lineTo(halfWidth, y - halfHeight);
      ctx.stroke();
    });
  }

  /**
   * Convert canvas coordinates to grid coordinates
   * @param {Number} x X coordinate on canvas
   * @param {Number} y Y coordinate on canvas
   * @returns {Object} Grid coordinates {x, y}
   */
  canvasToGrid(x, y) {
    const { cellSize, left, top, width, height } = this.schematic;
    
    // Adjust for object position
    const localX = x - left + width / 2;
    const localY = y - top + height / 2;
    
    // Convert to grid coordinates
    return {
      x: Math.floor(localX / cellSize),
      y: Math.floor(localY / cellSize)
    };
  }

  /**
   * Convert grid coordinates to canvas coordinates
   * @param {Number} gridX X coordinate on grid
   * @param {Number} gridY Y coordinate on grid
   * @returns {Object} Canvas coordinates {x, y}
   */
  gridToCanvas(gridX, gridY) {
    const { cellSize, left, top, width, height } = this.schematic;
    
    // Convert to canvas coordinates
    return {
      x: (gridX * cellSize) + left - width / 2,
      y: (gridY * cellSize) + top - height / 2
    };
  }

  /**
   * Update the schematic based on parent object changes
   */
  update() {
    // Force recalculation of grid coordinates
    this.gridCache = null;
  }
}
