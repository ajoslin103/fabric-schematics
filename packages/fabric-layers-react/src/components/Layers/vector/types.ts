import { Point, StyleProps } from '../../../types';

export interface VectorLayerProps {
  position?: Point;
  radius?: number;
  width?: number;
  height?: number;
  points?: Point[];
  style?: StyleProps;
  onSelect?: () => void;
  [key: string]: any;
}