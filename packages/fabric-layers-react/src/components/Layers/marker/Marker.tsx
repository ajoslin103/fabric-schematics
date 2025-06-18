import React, { useEffect, useRef } from 'react';
import { Marker as FabricMarker } from 'fabric-layers/layer/marker';
import type { MarkerProps } from '../../../types';

export const Marker: React.FC<MarkerProps> = ({
  position,
  icon,
  tooltip,
  onClick,
  onDragEnd,
  ...options
}) => {
  const markerRef = useRef<FabricMarker | null>(null);

  useEffect(() => {
    markerRef.current = new FabricMarker({
      position,
      icon,
      tooltip,
      ...options
    });

    if (onClick) {
      markerRef.current.on('click', onClick);
    }
    if (onDragEnd) {
      markerRef.current.on('dragend', onDragEnd);
    }

    return () => {
      if (markerRef.current) {
        if (onClick) {
          markerRef.current.off('click', onClick);
        }
        if (onDragEnd) {
          markerRef.current.off('dragend', onDragEnd);
        }
        markerRef.current.destroy();
        markerRef.current = null;
      }
    };
  }, [position, icon, tooltip]);

  return null; // Renders directly on canvas
};

export default Marker;