declare module 'fabric-layers' {
  export interface Point {
    x: number;
    y: number;
  }

  export class Circle {
    constructor(options: any);
    setOptions(options: any): void;
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
  }

  export class Canvas {
    constructor(container: HTMLElement, options?: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }

  export class Arrow {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }

  export class ArrowHead {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }

  export class PaintManager {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }

  export interface StyleProps {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    [key: string]: any;
  }

  export interface BaseLayer {
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }

  export class Map {
    constructor(container: HTMLElement, options?: any);
    addGrid(grid: Grid): void;
    removeGrid(grid: Grid): void;
    addPoint(point: Point): void;
    removePoint(point: Point): void;
    addMeasurement(measurement: Measurement): void;
    removeMeasurement(measurement: Measurement): void;
    registerMode(mode: string, handler: any): void;
    setMode(mode: string): void;
    registerEventListener(event: string, handler: Function): void;
    unregisterEventListener(event: string, handler: Function): void;
    dispose(): void;
  }

  export class Grid implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }

  export class Measurement implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }


  export class CorePoint {
    constructor(options: any);
    setOptions(options: any): void;
  }
}

declare module 'fabric-layers/layer' {
  import { BaseLayer } from 'fabric-layers';

  export class Connector implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }
  
  export class Group implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }
  
  export class Tooltip implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }
}

declare module 'fabric-layers/layer/marker' {
  import { BaseLayer } from 'fabric-layers';

  export class Icon implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }
  
  export class Marker implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }
  
  export class MarkerGroup implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }
}

declare module 'fabric-layers/layer/vector' {
  import { BaseLayer } from 'fabric-layers';

  export class Circle implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }
  
  export class Line implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }
  
  export class Polyline implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }
  
  export class Rect implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }
}

declare module 'fabric-layers/measurement' {
  import { BaseLayer } from 'fabric-layers';

  export class Measurement implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }
  
  export class Measurer implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }
}

declare module 'fabric-layers/paint' {
  import { BaseLayer } from 'fabric-layers';

  export class Arrow implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }
  
  export class ArrowHead implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }
  
  export class Canvas implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }
  
  export class PaintManager implements BaseLayer {
    constructor(options: any);
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
    destroy(): void;
    setOptions(options: any): void;
  }
}