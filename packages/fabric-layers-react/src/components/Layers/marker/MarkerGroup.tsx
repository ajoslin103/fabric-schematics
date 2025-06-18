import React, { useEffect, useRef } from 'react';
import { MarkerGroup as FabricMarkerGroup } from 'fabric-layers/layer/marker';
import type { MarkerGroupProps } from '../../../types';

export const MarkerGroup: React.FC<MarkerGroupProps> = ({
  markers,
  style,
  onSelect,
  ...options
}) => {
  const groupRef = useRef<FabricMarkerGroup | null>(null);

  useEffect(() => {
    groupRef.current = new FabricMarkerGroup({
      markers,
      style,
      ...options
    });

    if (onSelect) {
      groupRef.current.on('select', onSelect);
    }

    return () => {
      if (groupRef.current) {
        if (onSelect) {
          groupRef.current.off('select', onSelect);
        }
        groupRef.current.destroy();
        groupRef.current = null;
      }
    };
  }, [markers, style]);

  return null; // Renders directly on canvas
};

export default MarkerGroup;