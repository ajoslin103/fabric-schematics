import alpha from '../lib/color-alpha';
import gridStyle from './gridStyle';
import { almost, clamp } from '../lib/mumath/index';

class GridRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  setSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  setWidth(width) {
    this.canvas.width = width;
  }

  setHeight(height) {
    this.canvas.height = height;
  }

  // Render grid using calculated data
  render(gridData) {
    this.draw(gridData);
    return this;
  }

  // draw grid to the canvas
  draw(gridData) {
    console.log('GridRenderer.draw', gridData);
    if (!gridData) return;
    
    this.drawLines(gridData.xAxis);
    this.drawLines(gridData.yAxis);
  }

  // lines instance draw
  drawLines(state) {
    console.log('GridRenderer.drawLines', state);
    if (!state.lines.length) {
      console.log('No lines to draw');
      return;
    }
    
    const ctx = this.context;
    const [width, height] = state.shape;
    const [pt, pr, pb, pl] = state.padding;
    
    console.log('Drawing lines:', state.lines.length, 'lines');
    
    // draw lines
    ctx.lineWidth = state.lineWidth / 2;
    ctx.strokeStyle = state.lineColor;
    
    console.log('Canvas context:', { lineWidth: ctx.lineWidth, strokeStyle: ctx.strokeStyle });
    console.log('Shape:', { width, height });
    console.log('Padding:', { pt, pr, pb, pl });
    console.log('Padding array:', state.padding);
    console.log('Width - pl - pr:', width - pl - pr);
    console.log('Height - pt - pb:', height - pt - pb);
    
    ctx.beginPath();
    
    for (let i = 0; i < state.lines.length; i += 1) {
      if (almost(state.lines[i], state.opposite.coordinate.axisOrigin)) continue;
      
      const coords = state.coordinate.getCoords([state.lines[i]]);
      
      const x1 = pl + coords[0] * (width - pl - pr);
      const y1 = pt + coords[1] * (height - pt - pb);
      const x2 = pl + coords[2] * (width - pl - pr);
      const y2 = pt + coords[3] * (height - pt - pb);
      
      console.log(`Drawing line from (${x1}, ${y1}) to (${x2}, ${y2})`);
      
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    
    console.log('Calling ctx.stroke()');
    ctx.stroke();
    ctx.closePath();
    
    // draw ticks
    if (state.ticks.length) {
      const tickCoords = this.calculateTickCoords(state);
      
      ctx.lineWidth = state.axisWidth / 2;
      ctx.beginPath();
      
      for (let i = 0, j = 0; i < tickCoords.length; i += 4, j += 1) {
        if (almost(state.lines[j], state.opposite.coordinate.axisOrigin)) continue;
        
        const x1 = pl + tickCoords[i] * (width - pl - pr);
        const y1 = pt + tickCoords[i + 1] * (height - pt - pb);
        const x2 = pl + tickCoords[i + 2] * (width - pl - pr);
        const y2 = pt + tickCoords[i + 3] * (height - pt - pb);
        
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      
      ctx.strokeStyle = state.axisColor;
      ctx.stroke();
      ctx.closePath();
    }
    
    // draw axis
    if (state.coordinate.axis && state.axisColor) {
      const axisCoords = state.opposite.coordinate.getCoords([state.coordinate.axisOrigin]);
      
      ctx.lineWidth = state.axisWidth / 2;
      const x1 = pl + clamp(axisCoords[0], 0, 1) * (width - pr - pl);
      const y1 = pt + clamp(axisCoords[1], 0, 1) * (height - pt - pb);
      const x2 = pl + clamp(axisCoords[2], 0, 1) * (width - pr - pl);
      const y2 = pt + clamp(axisCoords[3], 0, 1) * (height - pt - pb);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = state.axisColor;
      ctx.stroke();
      ctx.closePath();
    }
    
    // draw labels
    this.drawLabels(state);
  }

  calculateTickCoords(state) {
    const coords = state.coords;
    const normals = [];
    
    const [width, height] = state.shape;
    const [pt, pr, pb, pl] = state.padding;
    
    // get axis ratio
    const axisRatio = state.coordinate.axisRatio;
    
    // calc normal vectors for each line
    for (let i = 0; i < coords.length; i += 4) {
      const x1 = coords[i];
      const y1 = coords[i + 1];
      const x2 = coords[i + 2];
      const y2 = coords[i + 3];
      const xDif = x2 - x1;
      const yDif = y2 - y1;
      const dist = Math.sqrt(xDif * xDif + yDif * yDif);
      normals.push(xDif / dist);
      normals.push(yDif / dist);
    }
    
    // calc tick coords
    const tickCoords = [];
    const ticks = state.ticks;
    
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
      tickCoords.push(normals[i] * (xDif + tick[0] * state.tickAlign) + x1);
      tickCoords.push(normals[i + 1] * (yDif + tick[1] * state.tickAlign) + y1);
      tickCoords.push(normals[i] * (xDif - tick[0] * (1 - state.tickAlign)) + x1);
      tickCoords.push(normals[i + 1] * (yDif - tick[1] * (1 - state.tickAlign)) + y1);
    }
    
    return tickCoords;
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
      const textOffset = state.tickAlign < 0.5
        ? -textHeight - state.axisWidth * 2 : state.axisWidth * 2;
      
      const isOpp = state.coordinate.orientation === 'y' && !state.opposite.disabled;
      
      for (let i = 0; i < state.labels.length; i += 1) {
        let label = state.labels[i];
        if (label == null) continue;

        if (isOpp && almost(state.lines[i], state.opposite.coordinate.axisOrigin)) continue;

        const textWidth = ctx.measureText(label).width;

        let textLeft = state.labelCoords[i * 2] * (width - pl - pr) + indent + pl;

        if (state.coordinate.orientation === 'y') {
          textLeft = clamp(textLeft, indent, width - textWidth - 1 - state.axisWidth);
          label *= -1;
        }

        let textTop = state.labelCoords[i * 2 + 1] * (height - pt - pb) + textOffset + pt;
        if (state.coordinate.orientation === 'x') {
          textTop = clamp(textTop, 0, height - textHeight - textOffset);
        }
        
        ctx.fillText(label, textLeft, textTop);
      }
    }
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
}

export default GridRenderer;
