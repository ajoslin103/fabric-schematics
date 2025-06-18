import React, { useEffect, useRef } from 'react';
import { Rect as FabricRect } from 'fabric-layers/layer/vector';
import type { VectorLayerProps } from './types';

export const Rect: React.FC<VectorLayerProps> = ({
  position,
  width,
  height,
  style,
  onSelect,
  ...options
}) => {
  const layerRef = useRef<FabricRect | null>(null);

  useEffect(() => {
    layerRef.current = new FabricRect({
      position,
      width,
      height,
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
  }, [position, width, height, style]);

  return null;
};

export default Rect;