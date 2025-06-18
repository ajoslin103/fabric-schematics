import React, { useEffect, useRef } from 'react';
import { Arrow as FabricArrow } from 'fabric-layers';
import type { ArrowProps } from '../../types';

export const Arrow: React.FC<ArrowProps> = ({
  start,
  end,
  headSize = 10,
  style,
  ...options
}) => {
  const arrowRef = useRef<FabricArrow | null>(null);

  useEffect(() => {
    arrowRef.current = new FabricArrow({
      start,
      end,
      headSize,
      style,
      ...options
    });

    return () => {
      if (arrowRef.current) {
        arrowRef.current.destroy();
        arrowRef.current = null;
      }
    };
  }, [start, end, headSize, style]);

  return null; // Renders directly on canvas
};

export default Arrow;