/**
 * SchematicAdapter.js
 * Adapter between Schematic Fabric.js object and grid drawing functionality
 */

// Uses grid calculation approach without importing Grid class directly

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
  }

  /**
   * Set canvas for rendering
   * @param {CanvasRenderingContext2D} canvas Canvas rendering context
   */
  setCanvas(canvas) {
    // Removed canvas and grid initialization
  }

  render(ctx) {
    if (!this.schematic.showGrid) return;
    
    const { width, height, cellSize, lineColor } = this.schematic;
    
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    
    // Draw grid lines using the same logic as existing Grid
    const xLines = Math.floor(width / cellSize) + 1;
    const yLines = Math.floor(height / cellSize) + 1;
    
    // Vertical lines
    for (let i = 0; i <= xLines; i++) {
      const x = i * cellSize - width/2;
      ctx.beginPath();
      ctx.moveTo(x, -height/2);
      ctx.lineTo(x, height/2);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= yLines; i++) {
      const y = i * cellSize - height/2;
      ctx.beginPath();
      ctx.moveTo(-width/2, y);
      ctx.lineTo(width/2, y);
      ctx.stroke();
    }
  }

  setCellSize(size) {
    // Grid logic would go here if we were using Grid class
    // For now, the Schematic object handles updates
  }

  setLineColor(color) {
    // Grid logic would go here if we were using Grid class
  }

  setGridVisibility(visible) {
    // Grid logic would go here if we were using Grid class
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
