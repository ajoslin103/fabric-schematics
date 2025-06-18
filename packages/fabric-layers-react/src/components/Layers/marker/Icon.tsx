import React, { useEffect, useRef } from 'react';
import { Icon as FabricIcon } from 'fabric-layers/layer/marker';
import type { IconProps } from '../../../types';

export const Icon: React.FC<IconProps> = ({
  url,
  width,
  height,
  anchor,
  ...options
}) => {
  const iconRef = useRef<FabricIcon | null>(null);

  useEffect(() => {
    iconRef.current = new FabricIcon({
      url,
      width,
      height,
      anchor,
      ...options
    });

    return () => {
      if (iconRef.current) {
        iconRef.current.destroy();
        iconRef.current = null;
      }
    };
  }, [url, width, height, anchor]);

  return null; // Renders directly on canvas
};

export default Icon;