import { StyleProps, Point } from 'fabric-layers';

export interface ConnectorProps {
  start: Point;
  end: Point;
  style?: StyleProps;
  onSelect?: () => void;
}

export interface GroupProps {
  layers: any[];
  style?: StyleProps;
  onSelect?: () => void;
  children?: React.ReactNode;
}

export interface IconProps {
  point: Point;
  url: string;
  width?: number;
  height?: number;
  anchor?: Point;
  style?: StyleProps;
}

export interface MarkerProps {
  position: Point;
  icon?: string;
  tooltip?: string;
  style?: StyleProps;
  onClick?: () => void;
  onDragEnd?: (position: Point) => void;
}

export interface MarkerGroupProps {
  markers: MarkerProps[];
  style?: StyleProps;
  onSelect?: () => void;
}

export interface TooltipProps {
  position: Point;
  content: React.ReactNode;
  style?: StyleProps;
}