import Base from '../core/Base';
import { clamp, almost, len, parseUnit, toPx, isObj } from '../lib/mumath/index';
import Axis from './Axis';
import { Point } from '../geometry/Point';

class GridCalculator extends Base {
  constructor(opts) {
    super(opts);
    this.state = {};
    this.setDefaults();
  }

  setOriginPin(corner) {
    this.isPinned = corner !== 'NONE';
    this.pinnedCorner = corner;
    // We can't calculate pinnedAbsolute here because we don't have canvas dimensions yet
    // This will be calculated when needed
    this.pinnedAbsolute = { x: 0, y: 0 };
  }

  setPinMargin(margin) {
    this.pinMargin = margin;
  }

  setZoomOverMouse(followMouse) {
    this.zoomOverMouse = followMouse;
  }

  getPinnedX(canvasWidth, zoom) {
    if (!this.isPinned || !this.pinnedCorner) return 0;
    const effectiveWidth = canvasWidth / zoom;
    const scaledMargin = this.pinMargin / zoom;
    if (this.pinnedCorner.includes('RIGHT')) {
      return -((effectiveWidth/2) - scaledMargin);
    }
    return ((effectiveWidth/2) - scaledMargin);
  }

  getPinnedY(canvasHeight, zoom) {
    if (!this.isPinned || !this.pinnedCorner) return 0;
    const effectiveHeight = canvasHeight / zoom;
    const scaledMargin = this.pinMargin / zoom;
    if (this.pinnedCorner.includes('BOTTOM')) { 
      return (effectiveHeight/2) - scaledMargin;
    }
    return -(effectiveHeight/2) + scaledMargin;
  }

  getCenterCoords(stateX, stateY) {
    let state = stateX;
    let [width, height] = state.shape;
    let [pt, pr, pb, pl] = state.padding;
    let axisCoords = state.opposite.coordinate.getCoords([state.coordinate.axisOrigin]);
    const y = pt + axisCoords[1] * (height - pt - pb);
    
    state = stateY;
    [width, height] = state.shape;
    [pt, pr, pb, pl] = state.padding;
    axisCoords = state.opposite.coordinate.getCoords([state.coordinate.axisOrigin]);
    const x = pl + axisCoords[0] * (width - pr - pl);
    return { x, y };
  }

  // re-evaluate lines, calc options for renderer
  calculateGridState(opts, canvasWidth, canvasHeight) {
    if (!opts) opts = {};
    const shape = [canvasWidth, canvasHeight];
    const center = opts.center || { x: 0, y: 0 };
    const zoom = opts.zoom || 1;

    // Create axis instances if they don't exist
    if (!this.axisX) {
      this.axisX = new Axis('x', opts);
    }
    if (!this.axisY) {
      this.axisY = new Axis('y', opts);
    }

    // Update axis with current values
    this.axisX.update({
      ...opts,
      offset: center.x,
      zoom: 1 / zoom,
      width: canvasWidth,
      height: canvasHeight
    });

    this.axisY.update({
      ...opts,
      offset: center.y,
      zoom: 1 / zoom,
      width: canvasWidth,
      height: canvasHeight
    });

    // recalc state
    const stateX = this.calcCoordinate(this.axisX, shape);
    const stateY = this.calcCoordinate(this.axisY, shape);
    stateX.opposite = stateY;
    stateY.opposite = stateX;

    // Debug logs
    console.log('GridCalculator.calculateGridState', { 
      canvasWidth, 
      canvasHeight, 
      center, 
      zoom,
      stateX,
      stateY
    });

    return {
      xAxis: stateX,
      yAxis: stateY,
      center: center,
      zoom: zoom
    };
  }

  // get state object with calculated params, ready for rendering
  calcCoordinate(coord, shape) {
    const state = {
      coordinate: coord,
      shape,
      grid: this
    };
    
    // calculate real offset/range
    state.range = coord.getRange(state);
    state.offset = clamp(
      coord.offset - state.range * clamp(0.5, 0, 1),
      Math.max(coord.min, -Number.MAX_VALUE + 1),
      Math.min(coord.max, Number.MAX_VALUE - 1)
    );
    
    // calculate shape: [width, height], padding
    state.padding = parseUnit(state.coordinate.padding, shape);
    
    // calculate lines
    state.lines = state.coordinate.getLines(state);
    
    // calculate ticks
    state.ticks = state.coordinate.getTicks(state);
    
    // calculate labels
    state.labels = state.coordinate.getLabels(state);
    
    // calculate coords for lines
    const coords = [];
    const normals = [];
    
    const [width, height] = shape;
    const [pt, pr, pb, pl] = state.padding;
    
    // get axis ratio
    const axisRatio = state.coordinate.axisRatio;
    
    // get lines coords
    state.coords = state.coordinate.getCoords(state.lines);
    
    // calc normal vectors for each line
    for (let i = 0; i < state.coords.length; i += 4) {
      const x1 = state.coords[i];
      const y1 = state.coords[i + 1];
      const x2 = state.coords[i + 2];
      const y2 = state.coords[i + 3];
      const xDif = x2 - x1;
      const yDif = y2 - y1;
      const dist = len(xDif, yDif);
      normals.push(xDif / dist);
      normals.push(yDif / dist);
    }
    
    // calc state.labels/tick coords
    const tickCoords = [];
    state.labelCoords = [];
    const ticks = state.ticks;
    
    for (let i = 0, j = 0, k = 0; i < normals.length; k += 1, i += 2, j += 4) {
      const x1 = state.coords[j];
      const y1 = state.coords[j + 1];
      const x2 = state.coords[j + 2];
      const y2 = state.coords[j + 3];
      const xDif = (x2 - x1) * axisRatio;
      const yDif = (y2 - y1) * axisRatio;
      const tick = [
        (normals[i] * ticks[k]) / (width - pl - pr),
        (normals[i + 1] * ticks[k]) / (height - pt - pb)
      ];
      tickCoords.push(normals[i] * (xDif + tick[0] * state.tickAlign) + x1);
      tickCoords.push(normals[i + 1] * (yDif + tick[1] * state.tickAlign) + y1);
      tickCoords.push(normals[i] * (xDif - tick[0] * (1 - state.tickAlign)) + x1);
      tickCoords.push(normals[i + 1] * (yDif - tick[1] * (1 - state.tickAlign)) + y1);
      state.labelCoords.push(normals[i] * xDif + x1);
      state.labelCoords.push(normals[i + 1] * yDif + y1);
    }
    
    return state;
  }

  setDefaults() {
    // stub methods
    // return coords for the values, redefined by axes
    this.getCoords = () => {};
    
    // return 0..1 ratio based on value/offset/range, redefined by axes
    this.getRatio = () => {};
    
    this.getCoords = (values) => {
      return state.coordinate.getCoords(values);
    };
    
    this.getRatio = (value) => {
      return state.coordinate.getRatio(value);
    };
    
    this.getCoords = (values, state) => {
      return state.coordinate.getCoords(values, state);
    };
    
    this.getRatio = (value) => {
      // FIXME: handle infinity case here
      return state.coordinate.getRatio(value);
    };
    
    this.getCoords = (values) => {
      return state.coordinate.getCoords(values);
    };
    
    this.getRatio = (value) => {
      return state.coordinate.getRatio(value);
    };
  }
}

export default GridCalculator;
