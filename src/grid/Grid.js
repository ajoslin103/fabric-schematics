import alpha from '../lib/color-alpha';
import Base from '../core/Base';
import {
  clamp, almost, len, parseUnit, toPx, isObj
} from '../lib/mumath/index';
import gridStyle from './gridStyle';
import Axis from './Axis';
import { Point } from '../geometry/Point';
import { DEBUG } from '../utils/debug';
import {
  calculatePinnedX,
  calculatePinnedY,
  calculateCenterCoords,
  calculateCoordinateState,
  calculateNormalVectors,
  calculateTickCoords,
  calculateLabelPosition,
  calculateAxisUpdates,
  calculateAxisLineCoords,
  adjustLabelPosition,
  shouldSkipAxisLine
} from '../lib/grid-calcs';

// import createEventSpy from '../utils/event-spy';
// const enableEventSpy = createEventSpy();
    
// constructor
class Grid extends Base {
  constructor(canvas, opts) {
    super(opts);
    
    // enableEventSpy('grid', this);

    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.state = {};
    this.setDefaults();
    
    // Store a reference to the map's style if available
    this.mapStyle = opts && opts.state && opts.state.style ? opts.state.style : null;
    DEBUG.GRID.GENERAL && console.log('[GRID:INIT] Initializing with map style:', this.mapStyle);
    
    this.update(opts);
  }

  setOriginPin(corner) {
    this.isPinned = corner !== 'NONE';
    this.pinnedCorner = corner;
    this.emit('originpin:change', corner);
    this.pinnedAbsolute = { x: this.getPinnedX(), y: this.getPinnedY() }
  }

  setPinMargin(margin) {
    this.pinMargin = margin;
    this.emit('pinmargin:change', margin);
  }


  getPinnedX() {
    const { width } = this.canvas;
    return calculatePinnedX(width, this.center.zoom, this.pinMargin, this.pinnedCorner);
  }

  getPinnedY() {
    const { height } = this.canvas;
    return calculatePinnedY(height, this.center.zoom, this.pinMargin, this.pinnedCorner);
  }

  render() {
    this.draw();
    return this;
  }

  getCenterCoords() {
    return calculateCenterCoords(this.state.x, this.state.y);
  }

  setSize(width, height) {
    this.setWidth(width);
    this.setHeight(height);
  }

  setWidth(width) {
    this.canvas.width = width;
  }

  setHeight(height) {
    this.canvas.height = height;
  }

  // re-evaluate lines, calc options for renderer
  update(opts) {
    if (!opts) opts = {};
    const shape = [this.canvas.width, this.canvas.height];

    // recalc state
    this.state.x = this.calcCoordinate(this.axisX, shape, this);
    this.state.y = this.calcCoordinate(this.axisY, shape, this);
    this.state.x.opposite = this.state.y;
    this.state.y.opposite = this.state.x;
    this.emit('update', opts);
    return this;
  }

  // re-evaluate lines, calc options for renderer
  update2(center) {
    // Use pure function to calculate axis updates
    const { updatedCenter, axisXOffset, axisYOffset, axisZoom } = calculateAxisUpdates(
      center, 
      this.isPinned, 
      this.getPinnedX(), 
      this.getPinnedY()
    );
    
    const shape = [this.canvas.width, this.canvas.height];
    Object.assign(this.center, updatedCenter);
    
    // Update map style if available
    if (center && center.state && center.state.style) {
      this.mapStyle = center.state.style;
      DEBUG.GRID.GENERAL && console.log('[GRID:UPDATE] Updated map style:', this.mapStyle);
      this.updateStyleFromMap();
    }
    
    // recalc state
    this.state.x = this.calcCoordinate(this.axisX, shape, this);
    this.state.y = this.calcCoordinate(this.axisY, shape, this);
    this.state.x.opposite = this.state.y;
    this.state.y.opposite = this.state.x;
    this.emit('update', updatedCenter);

    // Apply the calculated axis parameters
    this.axisX.offset = axisXOffset;
    this.axisX.zoom = axisZoom;

    this.axisY.offset = axisYOffset;
    this.axisY.zoom = axisZoom;
  }

  // get state object with calculated params, ready for rendering
  calcCoordinate(coord, shape) {
    const baseState = calculateCoordinateState(coord, shape);
    
    // Add grid reference needed for backward compatibility
    baseState.grid = this;
    
    return baseState;
  }

  setDefaults() {
    this.pixelRatio = window.devicePixelRatio;
    this.autostart = true;
    this.interactions = true;

    this.defaults = Object.assign(
      {
        type: 'linear',
        name: '',
        units: '',
        state: {},

        // visible range params
        minZoom: -Infinity,
        maxZoom: Infinity,
        min: -Infinity,
        max: Infinity,
        offset: 0,
        origin: 0.5,
        center: {
          x: 0,
          y: 0,
          zoom: 1
        },
        zoom: 1,
        zoomEnabled: true,
        panEnabled: true,

        pinnedCorner: 'NONE',
        pinnedAbsolute: { x: 0, y: 0 },
        isPinned: false,
        pinMargin: 0,

        // labels
        labels: true,
        fontSize: '11pt',
        fontFamily: 'serif',
        padding: 0,
        labelColor: 'rgb(0,0,255,1)',

        // lines params
        lines: true,
        tick: 8,
        tickAlign: 0.5,
        lineWidth: 1,
        distance: 13,
        style: 'lines',
        lineColor: 'rgba(0, 0, 255, 0.4)',

        // axis params
        axis: true,
        axisOrigin: 0,
        axisWidth: 2,
        axisColor: 'rgba(0, 0, 255, 0.8)',

        // stub methods
        // return coords for the values, redefined by axes
        getCoords: () => [0, 0, 0, 0],

        // return 0..1 ratio based on value/offset/range, redefined by axes
        getRatio: () => 0,

        // default label formatter
        format: v => v
      },
      gridStyle,
      this._options
    );

    this.axisX = new Axis('x', this.defaults);
    this.axisY = new Axis('y', this.defaults);

    this.axisX = Object.assign({}, this.defaults, {
      orientation: 'x',
      offset: this.center.x,
      getCoords: (values, state) => {
        const coords = [];
        if (!values) return coords;
        for (let i = 0; i < values.length; i += 1) {
          const t = state.coordinate.getRatio(values[i], state);
          coords.push(t);
          coords.push(0);
          coords.push(t);
          coords.push(1);
        }
        return coords;
      },
      getRange: state => state.shape[0] * state.coordinate.zoom,
      // FIXME: handle infinity case here
      getRatio: (value, state) => (value - state.offset) / state.range
    });
    this.axisY = Object.assign({}, this.defaults, {
      orientation: 'y',
      offset: this.center.y,
      getCoords: (values, state) => {
        const coords = [];
        if (!values) return coords;
        for (let i = 0; i < values.length; i += 1) {
          const t = state.coordinate.getRatio(values[i], state);
          coords.push(0);
          coords.push(t);
          coords.push(1);
          coords.push(t);
        }
        return coords;
      },
      getRange: state => state.shape[1] * state.coordinate.zoom,
      getRatio: (value, state) => 1 - (value - state.offset) / state.range
    });

    Object.assign(this, this.defaults);
    Object.assign(this, this._options);

    this.center = new Point(this.center);
  }

  // draw grid to the canvas
  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawLines(this.state.x);
    this.drawLines(this.state.y);
    return this;
  }

  // lines instance draw
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
      axisRatio = clamp(axisRatio, 0, 1);
    }

    // Get all coordinates for lines
    const coords = state.coordinate.getCoords(state.lines, state);
    state.coords = coords; // Store coords for later use

    // Draw lines
    ctx.lineWidth = state.lineWidth / 2;
    
    for (let i = 0, j = 0; i < coords.length; i += 4, j += 1) {
      // Use pure function to determine if line should be skipped
      if (shouldSkipAxisLine(state.lines[j], state.opposite)) continue;

      // apply line color
      const color = state.lineColors[j];
      if (!color) continue;
      
      ctx.strokeStyle = color;
      ctx.beginPath();
      
      const x1 = left + pl + coords[i] * (width - pl - pr);
      const y1 = top + pt + coords[i + 1] * (height - pt - pb);
      const x2 = left + pl + coords[i + 2] * (width - pl - pr);
      const y2 = top + pt + coords[i + 3] * (height - pt - pb);

      // draw path
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath();
    }

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
    
    // draw ticks
    if (state.ticks && state.ticks.length) {
      ctx.lineWidth = state.axisWidth / 2;
      ctx.beginPath();
      for (let i = 0, j = 0; i < tickCoords.length; i += 4, j += 1) {
        // Use pure function to determine if tick should be skipped
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
    
    // draw axis
    if (state.coordinate && state.coordinate.axis && state.axisColor && 
        state.opposite && state.opposite.coordinate) {
      const axisCoords = state.opposite.coordinate.getCoords(
        [state.coordinate.axisOrigin],
        state.opposite
      );
      
      // Use pure function to calculate axis line coordinates
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
    
    // draw labels
    this.drawLabels(state);
  }

  drawLabels(state) {
    if (state.labels) {
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
        
        // Use pure function to determine if label should be skipped
        if (isOpp && shouldSkipAxisLine(state.lines[i], state.opposite)) continue;
        
        const textWidth = ctx.measureText(label).width;
        
        // Calculate position using pure function
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
        
        // Use pure function to adjust label position based on constraints
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
  }
}

export default Grid;
