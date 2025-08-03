/**
 * gridCalculations.js
 * Utility functions for calculating grid coordinates and dimensions
 */

/**
 * Calculate grid coordinates based on dimensions and cell size
 * @param {Number} width Width of the grid area
 * @param {Number} height Height of the grid area
 * @param {Number} cellSize Size of each grid cell
 * @returns {Object} Grid coordinates {xCoords, yCoords}
 */
export function calcGridCoordinates(width, height, cellSize) {
  const xCoords = [];
  const yCoords = [];
  
  // Calculate all vertical line positions
  for (let x = 0; x <= width; x += cellSize) {
    xCoords.push(x);
  }
  
  // Calculate all horizontal line positions
  for (let y = 0; y <= height; y += cellSize) {
    yCoords.push(y);
  }
  
  return { xCoords, yCoords };
}

/**
 * Snap a coordinate to the nearest grid line
 * @param {Number} value Value to snap
 * @param {Number} gridSize Grid size to snap to
 * @returns {Number} Snapped value
 */
export function snapToGrid(value, gridSize) {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Calculate visible grid area based on viewport dimensions and position
 * @param {Number} viewportWidth Width of the viewport
 * @param {Number} viewportHeight Height of the viewport
 * @param {Number} offsetX X offset of the viewport
 * @param {Number} offsetY Y offset of the viewport
 * @param {Number} cellSize Size of each grid cell
 * @returns {Object} Visible grid info {startX, endX, startY, endY, visibleCols, visibleRows}
 */
export function calculateVisibleGrid(viewportWidth, viewportHeight, offsetX, offsetY, cellSize) {
  const startX = Math.floor(offsetX / cellSize) * cellSize;
  const startY = Math.floor(offsetY / cellSize) * cellSize;
  const endX = startX + viewportWidth + cellSize;
  const endY = startY + viewportHeight + cellSize;
  
  const visibleCols = Math.ceil((endX - startX) / cellSize);
  const visibleRows = Math.ceil((endY - startY) / cellSize);
  
  return {
    startX,
    startY,
    endX,
    endY,
    visibleCols,
    visibleRows
  };
}
