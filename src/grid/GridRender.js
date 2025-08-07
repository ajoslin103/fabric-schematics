import { DEBUG } from '../utils/debug';
import {
  calculateNormalVectors,
  calculateTickCoords,
  calculateLabelPosition,
  calculateAxisLineCoords,
  adjustLabelPosition,
  shouldSkipAxisLine
} from '../lib/grid-calcs';

/**
 * GridRender class
 * 
 * Responsible solely for rendering grid elements to a canvas.
 * Takes an existing canvas context and rendering instructions.
 */
class GridRender {
  /**
   * Create a new GridRender instance
   * @param {HTMLCanvasElement} canvas - The canvas element to render to
   */
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  /**
   * Clear the canvas
   */
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    return this;
  }

  /**
   * Draw grid lines, ticks, axes, and labels
   * @param {Object} stateX - X-axis state
   * @param {Object} stateY - Y-axis state
   */
  render(stateX, stateY) {
    this.clear();
    this.drawLines(stateX);
    this.drawLines(stateY);
    return this;
  }

  /**
   * Draw lines for a single axis
   * @param {Object} state - Axis state
   */
  drawLines(state) {
    if (!state || !state.coordinate || !state.lines || !state.lines.length) return;
    
    const ctx = this.context;
    const [width, height] = state.shape;
    const [pt, pr, pb, pl] = state.padding;
    const left = 0;
    const top = 0;
    
    // Get axis ratio
    let axisRatio = state.coordinate.axisRatio;
    if (axisRatio === undefined && state.opposite && state.opposite.coordinate) {
      axisRatio = state.opposite.coordinate.getRatio(state.coordinate.axisOrigin, state.opposite);
      axisRatio = Math.max(0, Math.min(axisRatio, 1)); // clamp between 0-1
    }

    // Get all coordinates for lines
    const coords = state.coordinate.getCoords(state.lines, state);
    state.coords = coords; // Store coords for later use

    // Draw lines
    ctx.lineWidth = state.lineWidth / 2;
    
    for (let i = 0, j = 0; i < coords.length; i += 4, j += 1) {
      // Skip lines that should not be drawn
      if (shouldSkipAxisLine(state.lines[j], state.opposite)) continue;

      // Apply line color
      const color = state.lineColors[j];
      if (!color) continue;
      
      ctx.strokeStyle = color;
      ctx.beginPath();
      
      const x1 = left + pl + coords[i] * (width - pl - pr);
      const y1 = top + pt + coords[i + 1] * (height - pt - pb);
      const x2 = left + pl + coords[i + 2] * (width - pl - pr);
      const y2 = top + pt + coords[i + 3] * (height - pt - pb);

      // Draw path
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
    }

    // Draw ticks and axis
    this.drawTicksAndAxis(state, coords, axisRatio);
    
    // Draw labels
    this.drawLabels(state);
  }

  /**
   * Draw ticks and axis line
   * @param {Object} state - Axis state
   * @param {Array} coords - Line coordinates
   * @param {Number} axisRatio - Axis ratio
   */
  drawTicksAndAxis(state, coords, axisRatio) {
    const ctx = this.context;
    const [width, height] = state.shape;
    const [pt, pr, pb, pl] = state.padding;
    const left = 0;
    const top = 0;

    // Calculate normal vectors for lines
    const normals = calculateNormalVectors(coords);
    
    // Calculate tick coordinates
    const { tickCoords, labelCoords } = calculateTickCoords(
      coords, 
      normals, 
      state.ticks, 
      width, 
      height, 
      state.padding, 
      axisRatio, 
      state.tickAlign
    );
    
    state.labelCoords = labelCoords;
    
    // Draw ticks
    if (state.ticks && state.ticks.length) {
      ctx.lineWidth = state.axisWidth / 2;
      ctx.beginPath();
      for (let i = 0, j = 0; i < tickCoords.length; i += 4, j += 1) {
        // Skip ticks that should not be drawn
        if (shouldSkipAxisLine(state.lines[j], state.opposite)) continue;
        const x1 = left + pl + tickCoords[i] * (width - pl - pr);
        const y1 = top + pt + tickCoords[i + 1] * (height - pt - pb);
        const x2 = left + pl + tickCoords[i + 2] * (width - pl - pr);
        const y2 = top + pt + tickCoords[i + 3] * (height - pt - pb);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.strokeStyle = state.axisColor;
      ctx.stroke();
      ctx.closePath();
    }
    
    // Draw axis
    if (state.coordinate && state.coordinate.axis && state.axisColor && 
        state.opposite && state.opposite.coordinate) {
      const axisCoords = state.opposite.coordinate.getCoords(
        [state.coordinate.axisOrigin],
        state.opposite
      );
      
      // Calculate axis line coordinates
      const lineCoords = calculateAxisLineCoords(
        axisCoords, 
        width, 
        height, 
        state.padding, 
        left, 
        top
      );
      
      if (lineCoords) {
        ctx.lineWidth = state.axisWidth / 2;
        ctx.beginPath();
        ctx.moveTo(lineCoords.x1, lineCoords.y1);
        ctx.lineTo(lineCoords.x2, lineCoords.y2);
        ctx.strokeStyle = state.axisColor;
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  /**
   * Draw labels for grid lines
   * @param {Object} state - Axis state
   */
  drawLabels(state) {
    if (!state.labels) return;
    
    const ctx = this.context;
    const [width, height] = state.shape;
    const [pt, pr, pb, pl] = state.padding;

    ctx.font = `300 ${state.fontSize}px ${state.fontFamily}`;
    ctx.fillStyle = state.labelColor;
    ctx.textBaseline = 'top';
    
    const textHeight = state.fontSize;
    const indent = state.axisWidth + 1.5;
    const isOpp = state.coordinate.orientation === 'y' && !state.opposite.disabled;
    
    for (let i = 0; i < state.labels.length; i += 1) {
      let label = state.labels[i];
      if (label == null) continue;
      
      // Skip labels that should not be drawn
      if (isOpp && shouldSkipAxisLine(state.lines[i], state.opposite)) continue;
      
      const textWidth = ctx.measureText(label).width;
      
      // Calculate position
      const { textLeft, textTop } = calculateLabelPosition(
        state.labelCoords, 
        i, 
        width, 
        height, 
        state.padding, 
        state.tickAlign, 
        state.fontSize, 
        state.axisWidth, 
        state.coordinate.orientation
      );
      
      // Adjust label position based on constraints
      const { finalTextLeft, finalTextTop, displayLabel } = adjustLabelPosition(
        textLeft,
        textTop,
        label,
        state.coordinate.orientation,
        width,
        height,
        textWidth,
        textHeight,
        indent,
        state.axisWidth,
        state.tickAlign
      );
      
      ctx.fillText(displayLabel, finalTextLeft, finalTextTop);
    }
  }

  /**
   * Change the canvas being rendered to
   * @param {HTMLCanvasElement} canvas - New canvas element
   */
  setCanvas(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    return this;
  }
}

export default GridRender;