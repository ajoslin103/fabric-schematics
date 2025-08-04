import { clamp, almost, len, parseUnit, toPx, isObj } from '../lib/mumath/index';
import alpha from '../lib/color-alpha';

/**
 * Calculate pinned X position based on canvas width and zoom
 */
export function calculatePinnedX(canvasWidth, zoom, pinMargin, cornerType) {
  const effectiveWidth = canvasWidth / zoom;
  const scaledMargin = pinMargin / zoom;
  if (cornerType.includes('RIGHT')) {
    return -((effectiveWidth/2) - scaledMargin);
  }
  return ((effectiveWidth/2) - scaledMargin);
}

/**
 * Calculate pinned Y position based on canvas height and zoom
 */
export function calculatePinnedY(canvasHeight, zoom, pinMargin, cornerType) {
  const effectiveHeight = canvasHeight / zoom;
  const scaledMargin = pinMargin / zoom;
  if (cornerType.includes('BOTTOM')) { 
    return (effectiveHeight/2) - scaledMargin;
  }
  return -(effectiveHeight/2) + scaledMargin;
}

/**
 * Calculate the center coordinates based on axis states
 */
export function calculateCenterCoords(stateX, stateY) {
  let [width, height] = stateX.shape;
  let [pt, pr, pb, pl] = stateX.padding;
  let axisCoords = stateX.opposite.coordinate.getCoords(
    [stateX.coordinate.axisOrigin],
    stateX.opposite
  );
  const y = pt + axisCoords[1] * (height - pt - pb);
  
  [width, height] = stateY.shape;
  [pt, pr, pb, pl] = stateY.padding;
  axisCoords = stateY.opposite.coordinate.getCoords(
    [stateY.coordinate.axisOrigin],
    stateY.opposite
  );
  const x = pl + axisCoords[0] * (width - pr - pl);
  return { x, y };
}

/**
 * Calculate coordinate state for rendering
 */
export function calculateCoordinateState(coord, shape) {
  const state = {
    coordinate: coord,
    shape
  };
  
  // Calculate real offset/range
  state.range = coord.getRange(state);
  state.offset = clamp(
    coord.offset - state.range * clamp(0.5, 0, 1),
    Math.max(coord.min, -Number.MAX_VALUE + 1),
    Math.min(coord.max, Number.MAX_VALUE) - state.range
  );
  
  state.zoom = coord.zoom;
  
  // Calculate style
  state.axisColor = typeof coord.axisColor === 'number'
    ? alpha(coord.color, coord.axisColor)
    : coord.axisColor || coord.color;
  
  state.axisWidth = coord.axisWidth || coord.lineWidth;
  state.lineWidth = coord.lineWidth;
  state.tickAlign = coord.tickAlign;
  state.labelColor = state.color;
  
  // Get padding
  if (typeof coord.padding === 'number') {
    state.padding = Array(4).fill(coord.padding);
  } else if (coord.padding instanceof Function) {
    state.padding = coord.padding(state);
  } else {
    state.padding = coord.padding;
  }
  
  // Calculate font
  if (typeof coord.fontSize === 'number') {
    state.fontSize = coord.fontSize;
  } else {
    const units = parseUnit(coord.fontSize);
    state.fontSize = units[0] * toPx(units[1]);
  }
  state.fontFamily = coord.fontFamily || 'sans-serif';
  
  // Get lines stops, including joined list of values
  let lines;
  if (coord.lines instanceof Function) {
    lines = coord.lines(state);
  } else {
    lines = coord.lines || [];
  }
  state.lines = lines;
  
  // Calculate colors
  if (coord.lineColor instanceof Function) {
    state.lineColors = coord.lineColor(state);
  } else if (Array.isArray(coord.lineColor)) {
    state.lineColors = coord.lineColor;
  } else {
    let color = alpha(coord.color, coord.lineColor);
    if (typeof coord.lineColor !== 'number') {
      color = coord.lineColor === false || coord.lineColor == null ? null : coord.color;
    }
    state.lineColors = Array(lines.length).fill(color);
  }
  
  // Calculate ticks
  let ticks;
  if (coord.ticks instanceof Function) {
    ticks = coord.ticks(state);
  } else if (Array.isArray(coord.ticks)) {
    ticks = coord.ticks;
  } else {
    const tick = coord.ticks === true || coord.ticks === true
      ? state.axisWidth * 2 : coord.ticks || 0;
    ticks = Array(lines.length).fill(tick);
  }
  state.ticks = ticks;
  
  // Calculate labels
  let labels;
  if (coord.labels === true) labels = state.lines;
  else if (coord.labels instanceof Function) {
    labels = coord.labels(state);
  } else if (Array.isArray(coord.labels)) {
    labels = coord.labels;
  } else if (isObj(coord.labels)) {
    labels = coord.labels;
  } else {
    labels = Array(state.lines.length).fill(null);
  }
  state.labels = labels;
  
  // Convert hashmap ticks/labels to lines + colors
  if (isObj(ticks)) {
    state.ticks = Array(lines.length).fill(0);
  }
  if (isObj(labels)) {
    state.labels = Array(state.lines.length).fill(null);
  }
  if (isObj(ticks)) {
    Object.keys(ticks).forEach((value, tick) => {
      state.ticks.push(tick);
      state.lines.push(parseFloat(value));
      state.lineColors.push(null);
      state.labels.push(null);
    });
  }
  
  if (isObj(labels)) {
    Object.keys(labels).forEach((label, value) => {
      state.labels.push(label);
      state.lines.push(parseFloat(value));
      state.lineColors.push(null);
      state.ticks.push(null);
    });
  }
  
  return state;
}

/**
 * Calculate normal vectors for coordinate lines
 */
export function calculateNormalVectors(coords) {
  const normals = [];
  
  for (let i = 0; i < coords.length; i += 4) {
    const x1 = coords[i];
    const y1 = coords[i + 1];
    const x2 = coords[i + 2];
    const y2 = coords[i + 3];
    const xDif = x2 - x1;
    const yDif = y2 - y1;
    const dist = len(xDif, yDif);
    normals.push(xDif / dist);
    normals.push(yDif / dist);
  }
  
  return normals;
}

/**
 * Calculate tick coordinates for grid lines
 */
export function calculateTickCoords(coords, normals, ticks, width, height, padding, axisRatio, tickAlign) {
  const [pt, pr, pb, pl] = padding;
  const tickCoords = [];
  const labelCoords = [];
  
  for (let i = 0, j = 0, k = 0; i < normals.length; k += 1, i += 2, j += 4) {
    const x1 = coords[j];
    const y1 = coords[j + 1];
    const x2 = coords[j + 2];
    const y2 = coords[j + 3];
    const xDif = (x2 - x1) * axisRatio;
    const yDif = (y2 - y1) * axisRatio;
    const tick = [
      (normals[i] * ticks[k]) / (width - pl - pr),
      (normals[i + 1] * ticks[k]) / (height - pt - pb)
    ];
    
    tickCoords.push(normals[i] * (xDif + tick[0] * tickAlign) + x1);
    tickCoords.push(normals[i + 1] * (yDif + tick[1] * tickAlign) + y1);
    tickCoords.push(normals[i] * (xDif - tick[0] * (1 - tickAlign)) + x1);
    tickCoords.push(normals[i + 1] * (yDif - tick[1] * (1 - tickAlign)) + y1);
    
    labelCoords.push(normals[i] * xDif + x1);
    labelCoords.push(normals[i + 1] * yDif + y1);
  }
  
  return { tickCoords, labelCoords };
}

/**
 * Calculate text positioning for labels
 */
export function calculateLabelPosition(labelCoords, index, width, height, padding, tickAlign, fontSize, axisWidth, orientation) {
  const [pt, pr, pb, pl] = padding;
  const textHeight = fontSize;
  const indent = axisWidth + 1.5;
  const textOffset = tickAlign < 0.5
    ? -textHeight - axisWidth * 2 
    : axisWidth * 2;
  
  let textLeft = labelCoords[index * 2] * (width - pl - pr) + indent + pl;
  let textTop = labelCoords[index * 2 + 1] * (height - pt - pb) + textOffset + pt;
  
  return { textLeft, textTop };
}
