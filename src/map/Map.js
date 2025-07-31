import panzoom from '../lib/panzoom'; // a smooth customer
import { clamp } from '../lib/mumath/index';

import Base from '../core/Base';
import { MAP, Modes } from '../core/Constants';
import Grid from '../grid/Grid';
import { FabricLayersPoint } from '../geometry/Point';
import ModesMixin from './ModesMixin';
import { mix } from '../lib/mix';

export class Map extends mix(Base).with(ModesMixin) {
  constructor(container, options) {
    super(options);

    this.defaults = Object.assign({}, MAP);
    
    // set defaults
    Object.assign(this, this.defaults);

    this.originPin = 'NONE';
    this.pinMargin = 10;
    this.zoomOverMouse = true;

    // overwrite options
    Object.assign(this, this._options);

    this.center = new FabricLayersPoint(this.center);

    this.container = container || document.body;

    const canvas = document.createElement('canvas');
    this.container.appendChild(canvas);
    canvas.setAttribute('id', 'fabric-layers-canvas');

    canvas.width = this.width || this.container.clientWidth;
    canvas.height = this.height || this.container.clientHeight;

    this.canvas = new fabric.Canvas(canvas, {
      preserveObjectStacking: true,
      renderOnAddRemove: true
    });
    this.context = this.canvas.getContext('2d');

    this.on('render', () => {
      if (this.autostart) this.clear();
    });

    this.originX = -this.canvas.width / 2;
    this.originY = -this.canvas.height / 2;

    this.canvas.absolutePan({
      x: this.originX,
      y: this.originY
    });

    this.x = this.center.x;
    this.y = this.center.y;
    this.dx = 0;
    this.dy = 0;

    if (this.showGrid) {
      this.addGrid();
    }

    this.setMode(this.mode || Modes.GRAB);

    const vm = this;
    panzoom(this.container, e => {
      vm.panzoom(e);
    });

    this.registerListeners();

    setTimeout(() => {
      this.emit('ready', this);
    }, 300);
  }

  // Layer functionality removed (not used in grid demo)

  addGrid() {
    this.gridCanvas = this.cloneCanvas();
    this.gridCanvas.setAttribute('id', 'fabric-layers-grid-canvas');
    this.grid = new Grid(this.gridCanvas, this);
    
    // Set grid properties from map settings
    this.grid.setOriginPin(this.originPin);
    this.grid.setPinMargin(this.pinMargin);
    this.grid.setZoomOverMouse(this.zoomOverMouse);
    
    this.grid.draw();
  }

  // moveTo functionality removed (not used in grid demo)

  cloneCanvas(canvas) {
    canvas = canvas || this.canvas;
    const clone = document.createElement('canvas');
    clone.width = canvas.width;
    clone.height = canvas.height;
    
    // Add absolute positioning to ensure proper overlay
    clone.style.position = 'absolute';
    clone.style.top = '0';
    clone.style.left = '0';
    
    canvas.wrapperEl.appendChild(clone);
    return clone;
  }

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
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    this.canvas.forEachObject(obj => {
      const coords = obj.getBounds();

      coords.forEach(point => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
      });
    });

    return [new FabricLayersPoint(minX, minY), new FabricLayersPoint(maxX, maxY)];
  }

  fitBounds(padding = 100) {
    this.onResize();

    const { width, height } = this.canvas;

    this.originX = -this.canvas.width / 2;
    this.originY = -this.canvas.height / 2;

    const bounds = this.getBounds();

    this.center.x = (bounds[0].x + bounds[1].x) / 2.0;
    this.center.y = -(bounds[0].y + bounds[1].y) / 2.0;

    const boundWidth = Math.abs(bounds[0].x - bounds[1].x) + padding;
    const boundHeight = Math.abs(bounds[0].y - bounds[1].y) + padding;
    const scaleX = width / boundWidth;
    const scaleY = height / boundHeight;

    this.zoom = Math.min(scaleX, scaleY);

    this.canvas.setZoom(this.zoom);

    this.canvas.absolutePan({
      x: this.originX + this.center.x * this.zoom,
      y: this.originY - this.center.y * this.zoom
    });

    this.update();
    setTimeout(() => {
      this.update();
    }, 0);
  }

  setCursor(cursor) {
    this.container.style.cursor = cursor;
  }

  reset() {
    const { width, height } = this.canvas;
    this.zoom = this._options.zoom || 1;
    this.center = new FabricLayersPoint();
    this.originX = -this.canvas.width / 2;
    this.originY = -this.canvas.height / 2;
    this.canvas.absolutePan({
      x: this.originX,
      y: this.originY
    });
    this.x = width / 2.0;
    this.y = height / 2.0;
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

    this.canvas.setWidth(width);
    this.canvas.setHeight(height);

    if (this.grid) {
      this.grid.setSize(width, height);
    }

    const dx = width / 2.0 - oldWidth / 2.0;
    const dy = height / 2.0 - oldHeight / 2.0;

    this.canvas.relativePan({
      x: dx,
      y: dy
    });

    this.update();
  }

  update() {
    const canvas = this.canvas;

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

    // canvas.zoomToPoint(new Point(this.x, this.y), this.zoom);

    if (this.isGrabMode() || this.isRight) {
      canvas.relativePan(new FabricLayersPoint(this.dx, this.dy));
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

    const objects = canvas.getObjects();
    let hasKeepZoom = false;
    for (let i = 0; i < objects.length; i += 1) {
      const object = objects[i];
      if (object.keepOnZoom) {
        object.set('scaleX', 1.0 / this.zoom);
        object.set('scaleY', 1.0 / this.zoom);
        object.setCoords();
        hasKeepZoom = true;
        this.emit(`${object.class}scaling`, object);
      }
    }
    if (hasKeepZoom) canvas.requestRenderAll();
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

    const dx = this.center.x - view.x;
    const dy = -this.center.y + view.y;

    this.center.copy(view);

    this.canvas.relativePan(new FabricLayersPoint(dx * this.zoom, dy * this.zoom));

    this.canvas.renderAll();

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
    this.canvas.off('object:moving');
    this.canvas.off('object:moved');
  }

  // Marker functionality removed (not used in grid demo)
}

export default Map;
