import React, { useEffect, useRef } from 'react';
import { ArrowHead as FabricArrowHead } from 'fabric-layers';
import type { ArrowHeadProps } from '../../types';

export const ArrowHead: React.FC<ArrowHeadProps> = ({
  position,
  angle,
  size = 10,
  style,
  ...options
}) => {
  const arrowHeadRef = useRef<FabricArrowHead | null>(null);

  useEffect(() => {
    arrowHeadRef.current = new FabricArrowHead({
      position,
      angle,
      size,
      style,
      ...options
    });

    return () => {
      if (arrowHeadRef.current) {
        arrowHeadRef.current.destroy();
        arrowHeadRef.current = null;
      }
    };
  }, [position, angle, size, style]);

  return null; // Renders directly on canvas
};

export default ArrowHead;