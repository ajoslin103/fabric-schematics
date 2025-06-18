import React, { useEffect, useRef } from 'react';
import { Circle as FabricCircle } from 'fabric-layers';
import type { VectorLayerProps } from './types';

export const Circle: React.FC<VectorLayerProps> = ({
  position,
  radius,
  style,
  onSelect,
  ...options
}) => {
  const layerRef = useRef<FabricCircle | null>(null);

  useEffect(() => {
    layerRef.current = new FabricCircle({
      position,
      radius,
      style,
      ...options
    });

    if (onSelect) {
      layerRef.current.on('select', onSelect);
    }

    return () => {
      if (layerRef.current) {
        if (onSelect) {
          layerRef.current.off('select', onSelect);
        }
        layerRef.current.destroy();
        layerRef.current = null;
      }
    };
  }, [position, radius, style]);

  return null; // Renders directly on canvas
};

export default Circle;