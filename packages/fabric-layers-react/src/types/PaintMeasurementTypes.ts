import { Point, StyleProps } from 'fabric-layers';

export interface ArrowProps {
  start: Point;
  end: Point;
  headSize?: number;
  style?: StyleProps;
}

export interface ArrowHeadProps {
  position: Point;
  angle: number;
  size?: number;
  style?: StyleProps;
}

export interface CanvasProps {
  width: number;
  height: number;
  backgroundColor?: string;
  onModified?: () => void;
}

export interface MeasurementProps {
  start: Point;
  end: Point;
  unit?: string;
  precision?: number;
  onUpdate?: () => void;
  style?: StyleProps;
}

export interface MeasurerProps {
  mode?: string;
  unit?: string;
  precision?: number;
  onMeasureStart?: (position: Point) => void;
  onMeasureEnd?: (measurement: any) => void;
  onStart?: (position: Point) => void;
  onUpdate?: (start: Point, end: Point) => void;
  onComplete?: (measurement: any) => void;
  style?: StyleProps;
}

export interface PaintManagerProps {
  mode?: string;
  color?: string;
  width?: number;
  onDrawStart?: (position: Point) => void;
  onDrawEnd?: (shape: any) => void;
  onStart?: (position: Point) => void;
  onUpdate?: (start: Point, end: Point) => void;
  onComplete?: (shape: any) => void;
  style?: StyleProps;
}