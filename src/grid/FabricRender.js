import {
  calculateNormalVectors,
  calculateTickCoords,
  calculateLabelPosition,
  calculateAxisLineCoords,
  adjustLabelPosition,
  shouldSkipAxisLine
} from '../lib/grid-calcs';
import { fabric } from '../utils/fabric';

/**
 * FabricRender class
 * 
 * Responsible for rendering grid elements using fabric.js instead of canvas.
 * Takes a fabric.js canvas and handles all grid rendering.
 */
class FabricRender {
  /**
   * Create a new FabricRender instance
   * @param {fabric.Canvas} fabricCanvas - The fabric.js canvas to render to
   */
  constructor(fabricCanvas) {
    this.fabricCanvas = fabricCanvas;
    this.gridObjects = [];
  }

  /**
   * Clear all grid objects from the canvas
   */
  clear() {
    // Remove all existing grid objects
    this.gridObjects.forEach(obj => {
      this.fabricCanvas.remove(obj);
    });
    this.gridObjects = [];
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
    this.fabricCanvas.renderAll();
    return this;
  }

  /**
   * Draw lines for a single axis
   * @param {Object} state - Axis state
   */
  drawLines(state) {
    if (!state || !state.coordinate || !state.lines || !state.lines.length) return;
    
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
    for (let i = 0, j = 0; i < coords.length; i += 4, j += 1) {
      // Skip lines that should not be drawn
      if (shouldSkipAxisLine(state.lines[j], state.opposite)) continue;

      // Apply line color
      const color = state.lineColors[j];
      if (!color) continue;
      
      const x1 = left + pl + coords[i] * (width - pl - pr);
      const y1 = top + pt + coords[i + 1] * (height - pt - pb);
      const x2 = left + pl + coords[i + 2] * (width - pl - pr);
      const y2 = top + pt + coords[i + 3] * (height - pt - pb);

      // Create fabric line
      const line = new fabric.Line([x1, y1, x2, y2], {
        stroke: color,
        strokeWidth: state.lineWidth / 2,
        selectable: false,
        evented: false,
        originX: 'left',
        originY: 'top'
      });

      // Add to canvas and track
      this.fabricCanvas.add(line);
      this.gridObjects.push(line);
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
      for (let i = 0, j = 0; i < tickCoords.length; i += 4, j += 1) {
        // Skip ticks that should not be drawn
        if (shouldSkipAxisLine(state.lines[j], state.opposite)) continue;
        
        const x1 = left + pl + tickCoords[i] * (width - pl - pr);
        const y1 = top + pt + tickCoords[i + 1] * (height - pt - pb);
        const x2 = left + pl + tickCoords[i + 2] * (width - pl - pr);
        const y2 = top + pt + tickCoords[i + 3] * (height - pt - pb);
        
        // Create fabric line for tick
        const tick = new fabric.Line([x1, y1, x2, y2], {
          stroke: state.axisColor,
          strokeWidth: state.axisWidth / 2,
          selectable: false,
          evented: false,
          originX: 'left',
          originY: 'top'
        });
        
        // Add to canvas and track
        this.fabricCanvas.add(tick);
        this.gridObjects.push(tick);
      }
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
        // Create fabric line for axis
        const axis = new fabric.Line(
          [lineCoords.x1, lineCoords.y1, lineCoords.x2, lineCoords.y2], 
          {
            stroke: state.axisColor,
            strokeWidth: state.axisWidth / 2,
            selectable: false,
            evented: false,
            originX: 'left',
            originY: 'top'
          }
        );
        
        // Add to canvas and track
        this.fabricCanvas.add(axis);
        this.gridObjects.push(axis);
      }
    }
  }

  /**
   * Draw labels for grid lines
   * @param {Object} state - Axis state
   */
  drawLabels(state) {
    if (!state.labels) return;
    
    const [width, height] = state.shape;
    const [pt, pr, pb, pl] = state.padding;

    const textHeight = state.fontSize;
    const indent = state.axisWidth + 1.5;
    const isOpp = state.coordinate.orientation === 'y' && !state.opposite.disabled;
    
    for (let i = 0; i < state.labels.length; i += 1) {
      let label = state.labels[i];
      if (label == null) continue;
      
      // Skip labels that should not be drawn
      if (isOpp && shouldSkipAxisLine(state.lines[i], state.opposite)) continue;
      
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
      
      // Create temporary canvas text to measure width
      const tmpText = new fabric.Text(String(label), {
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        fontWeight: 300,
        textBaseline: 'alphabetic'
      });
      const textWidth = tmpText.width;
      
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
      
      // Create fabric text for label
      const text = new fabric.Text(String(displayLabel), {
        left: finalTextLeft,
        top: finalTextTop,
        fontSize: state.fontSize,
        fontFamily: state.fontFamily,
        fontWeight: 300,
        fill: state.labelColor,
        selectable: false,
        evented: false,
        originX: 'left',
        originY: 'top',
        textBaseline: 'alphabetic'
      });
      
      // Add to canvas and track
      this.fabricCanvas.add(text);
      this.gridObjects.push(text);
    }
  }

  /**
   * Change the fabric canvas being rendered to
   * @param {fabric.Canvas} fabricCanvas - New fabric canvas
   */
  setCanvas(fabricCanvas) {
    this.clear();
    this.fabricCanvas = fabricCanvas;
    return this;
  }
}

export default FabricRender;