import React, { useEffect, useRef } from 'react';
import { Polyline as FabricPolyline } from 'fabric-layers/layer/vector';
import type { VectorLayerProps } from './types';

export const Polyline: React.FC<VectorLayerProps> = ({
  points = [],
  style,
  onSelect,
  ...options
}) => {
  const layerRef = useRef<FabricPolyline | null>(null);

  useEffect(() => {
    layerRef.current = new FabricPolyline({
      points,
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
  }, [points, style]);

  return null;
};

export default Polyline;