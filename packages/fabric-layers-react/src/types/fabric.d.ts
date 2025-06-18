declare module 'fabric' {
  export namespace fabric {
    export interface ICanvasOptions {
      width?: number;
      height?: number;
      backgroundColor?: string;
      [key: string]: any;
    }

    export class Canvas {
      constructor(element: HTMLCanvasElement | string, options?: ICanvasOptions);
      add(object: Object): Canvas;
      remove(object: Object): Canvas;
      renderAll(): Canvas;
      getActiveObjects(): Object[];
      on(eventName: string, handler: (e: any) => any): Canvas;
      off(eventName: string, handler?: (e: any) => any): Canvas;
      dispose(): void;
    }

    export class Object {
      type: string;
      visible: boolean;
      name?: string;
      data?: any;
      
      on(eventName: string, handler: (e: any) => any): Object;
      off(eventName?: string, handler?: (e: any) => any): Object;
      set(options: any): Object;
      get(property: string): any;
      toObject(propertiesToInclude?: string[]): Record<string, any>;
    }

    export interface Point {
      x: number;
      y: number;
    }

    export interface TPointerEvent {
      e: Event;
      target?: Object;
      button?: number;
      isClick?: boolean;
      pointer?: Point;
      absolutePointer?: Point;
      transform?: any;
    }

    export interface TPointerEventInfo extends TPointerEvent {
      selected?: Object[];
      deselected?: Object[];
      updated?: Object[];
      target?: Object;
      subTargets?: Object[];
    }
  }

  export import Canvas = fabric.Canvas;
  export import Object = fabric.Object;
  export import Point = fabric.Point;
  export import TPointerEvent = fabric.TPointerEvent;
  export import TPointerEventInfo = fabric.TPointerEventInfo;
}