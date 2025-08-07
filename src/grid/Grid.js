import Base from '../core/Base';
import gridStyle from './gridStyle';
import Axis from './Axis';
import { Point } from '../geometry/Point';
import { DEBUG } from '../utils/debug';
import GridRender from './GridRender';
import {
  calculatePinnedX,
  calculatePinnedY,
  calculateCenterCoords,
  calculateCoordinateState,
  calculateAxisUpdates
} from '../lib/grid-calcs';

// constructor
class Grid extends Base {
  constructor(canvas, opts) {
    super(opts);
    
    this.canvas = canvas;
    this.state = {};
    this.setDefaults();
    
    // Store a reference to the map's style if available
    this.mapStyle = opts && opts.state && opts.state.style ? opts.state.style : null;
    DEBUG.GRID.GENERAL && console.log('[GRID:INIT] Initializing with map style:', this.mapStyle);
    
    // Create renderer
    this.renderer = new GridRender(canvas);
    
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
    // Use the renderer to draw the grid
    this.renderer.render(this.state.x, this.state.y);
    return this;
  }

  /**
   * Update map style if available
   */
  updateStyleFromMap() {
    // This is a placeholder for style update logic
    // In the future, this could be implemented to apply styles from the map
  }
}

export default Grid;