import panzoom from '../lib/panzoom'; // a smooth customer
import { clamp } from '../lib/mumath/index';

import Base from '../core/Base';
import { MAP } from '../core/Constants';
import Grid from '../grid/Grid';
import { Point } from '../geometry/Point';
import ModesMixin from './ModesMixin';
import { mix } from '../lib/mix';

import createEventSpy from '../utils/event-spy';
const enableEventSpy = createEventSpy();

export class Map extends mix(Base).with(ModesMixin) {
  constructor(container, options) {
    super(options);

    enableEventSpy('map', this);

    this.defaults = Object.assign({}, MAP);
    
    // set defaults
    Object.assign(this, this.defaults);

    this.originPin = 'NONE';
    this.pinMargin = 10;
    this.zoomOverMouse = true;

    // overwrite options
    Object.assign(this, this._options);

    this.center = new Point(this.center);

    this.container = container || document.body;

    this.canvas = document.createElement('canvas');
    this.container.appendChild(this.canvas);
    this.canvas.setAttribute('id', 'schematics-canvas');

    this.canvas.width = this.width || this.container.clientWidth;
    this.canvas.height = this.height || this.container.clientHeight;

    // this.context = this.canvas.getContext('2d');

    this.originX = -this.canvas.width / 2;
    this.originY = -this.canvas.height / 2;

    this.x = this.center.x;
    this.y = this.center.y;
    this.dx = 0;
    this.dy = 0;

    const vm = this;
    panzoom(this.container, e => {
      vm.panzoom(e);
    });

    this.registerListeners();

    setTimeout(() => {
      this.emit('ready', this);
    }, 300);
  }

  addGrid() {
    // this.gridCanvas = this.cloneCanvas();
    // this.gridCanvas.setAttribute('id', 'schematics-grid-canvas');
    this.grid = new Grid(this.canvas, this);
    
    // Set grid properties from map settings
    this.grid.setOriginPin(this.originPin);
    this.grid.setPinMargin(this.pinMargin);
    this.grid.setZoomOverMouse(this.zoomOverMouse);
    
    this.grid.draw();
  }

  // cloneCanvas() {
  //   const clone = document.createElement('canvas');
  //   clone.width = this.canvas.width;
  //   clone.height = this.canvas.height;
    
  //   // Add absolute positioning to ensure proper overlay
  //   clone.style.position = 'absolute';
  //   clone.style.top = '0';
  //   clone.style.left = '0';
    
  //   // Insert into container
  //   this.container.appendChild(clone);
  //   return clone;
  // }

  setZoom(zoom) {
    const { width, height } = this.canvas;
    this.zoom = clamp(zoom, this.minZoom, this.maxZoom);
    this.dx = 0;
    this.dy = 0;
    this.x = width / 2.0;
    this.y = height / 2.0;
    this.update();
    setTimeout(() => {
      this.update();
    }, 0);
  }

  getBounds() {
    // Return default bounds since we're not managing objects
    const width = this.canvas.width;
    const height = this.canvas.height;
    return [
      new Point(-width/2, -height/2), 
      new Point(width/2, height/2)
    ];
  }

  fitBounds(padding = 100) {
    this.onResize();

    const { width, height } = this.fabric;

    this.originX = -this.fabric.width / 2;
    this.originY = -this.fabric.height / 2;

    const bounds = this.getBounds();
    this.update();

    setTimeout(() => {
      this.update();
    }, 0);
  }

  setCursor(cursor) {
    this.container.style.cursor = cursor;
  }

  reset() {
    this.onResize();

    this.originX = -this.canvas.width / 2;
    this.originY = -this.canvas.height / 2;

    this.update();

    setTimeout(() => {
      this.update();
    }, 0);
  }

  onResize(width, height) {
    const oldWidth = this.canvas.width;
    const oldHeight = this.canvas.height;

    width = width || this.container.clientWidth;
    height = height || this.container.clientHeight;

    this.canvas.width = width;
    this.canvas.height = height;

    if (this.grid) {
      this.grid.setSize(width, height);
    }

    this.originX = -width / 2;
    this.originY = -height / 2;

    this.update();
  }

  update() {
    if (this.grid) {
      this.grid.update2({
        x: this.center.x,
        y: this.center.y,
        zoom: this.zoom
      });
    }

    this.emit('update', this);
    
    if (this.grid) {
      this.grid.render();
    }

    if (this.isGrabMode() || this.isRight) {
      this.emit('panning');
      this.setCursor('grab');
    } else {
      this.setCursor('pointer');
    }

    const now = Date.now();
    if (!this.lastUpdatedTime && Math.abs(this.lastUpdatedTime - now) < 100) {
      return;
    }
    this.lastUpdatedTime = now;
  }

  panzoom(e) {
    const { width, height } = this.canvas;
    const zoom = clamp(-e.dz, -height * 0.75, height * 0.75) / height;

    const prevZoom = 1 / this.zoom;
    let curZoom = prevZoom * (1 - zoom);
    curZoom = clamp(curZoom, this.minZoom, this.maxZoom);

    let { x, y } = this.center;

    // pan
    const oX = 0.5;
    const oY = 0.5;
    if (this.isGrabMode() || e.isRight) {
      x -= prevZoom * e.dx;
      y += prevZoom * e.dy;
      this.setCursor('grab');
    } else {
      this.setCursor('pointer');
    }

    if (this.zoomEnabled) {
      let tx, ty;
      if (this.grid && this.grid.zoomOverMouse) {
        // Zoom centered on mouse position
        tx = e.x / width - oX;
        ty = oY - e.y / height;
      } else {
        // Zoom centered on viewport center
        tx = 0;
        ty = 0;
      }
      x -= width * (curZoom - prevZoom) * tx;
      y -= height * (curZoom - prevZoom) * ty;
    }

    this.center.setX(x);
    this.center.setY(y);
    this.zoom = 1 / curZoom;
    this.dx = e.dx;
    this.dy = e.dy;
    this.x = e.x0;
    this.y = e.y0;
    this.isRight = e.isRight;

    this.update();
  }

  setView(view) {
    this.dx = 0;
    this.dy = 0;
    this.x = 0;
    this.y = 0;
    view.y *= -1;

    this.center.copy(view);

    this.update();

    setTimeout(() => {
      this.update();
    }, 0);
  }

  setOriginPin(corner) {
    this.originPin = corner;
    if (this.grid) {  
      this.grid.setOriginPin(corner);
    }
  }

  setPinMargin(margin) {
    this.pinMargin = margin;
    if (this.grid) {
      this.grid.setPinMargin(margin);
    }
  }

  setZoomOverMouse(followMouse) {
    this.zoomOverMouse = followMouse;
    if (this.grid) {
      this.grid.setZoomOverMouse(followMouse);
    }
  }

  registerListeners() {
    const vm = this;

    // Only keep the window resize handler - removed all layer-related event handlers
    window.addEventListener('resize', () => {
      vm.onResize();
    });
  }

  unregisterListeners() {
    // No fabric events to unregister
  }

  // Marker functionality removed (not used in grid demo)
}

export default Map;
