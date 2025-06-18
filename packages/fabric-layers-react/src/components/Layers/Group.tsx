import React, { useEffect, useRef } from 'react';
import { Group as FabricGroup } from 'fabric-layers/layer';
import type { GroupProps } from '../../types';

export const Group: React.FC<GroupProps> = ({
  layers,
  style,
  onSelect,
  ...options
}) => {
  const groupRef = useRef<FabricGroup | null>(null);

  useEffect(() => {
    groupRef.current = new FabricGroup({
      layers,
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
  }, [layers, style]);

  return null; // Renders directly on canvas
};

export default Group;