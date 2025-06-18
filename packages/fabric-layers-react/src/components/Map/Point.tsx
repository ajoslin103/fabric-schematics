import React, { useEffect, useRef } from 'react';
import { Point as CorePoint, Map as CoreMap } from 'fabric-layers';
import type { Point as PointType, StyleProps } from '../../types';

interface PointProps {
  position: PointType;
  style?: StyleProps;
  onDragEnd?: (position: PointType) => void;
  map: CoreMap | null;
  [key: string]: any;
}

export const Point: React.FC<PointProps> = ({
  position,
  style,
  onDragEnd,
  map,
  ...options
}) => {
  const pointRef = useRef<any>(null);

  useEffect(() => {
    if (!map) return;

    pointRef.current = {
      position,
      style,
      ...options
    };
    map.addPoint(pointRef.current);

    if (onDragEnd) {
      pointRef.current.on('dragend', () => {
        onDragEnd(pointRef.current.position);
      });
    }

    return () => {
      if (map && pointRef.current) {
        if (onDragEnd) {
          pointRef.current.off('dragend');
        }
        map.removePoint(pointRef.current);
        pointRef.current = null;
      }
    };
  }, [map, position, style]);

  return null;
};

export default Point;