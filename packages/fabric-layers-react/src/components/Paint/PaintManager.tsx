import React, { useEffect, useRef } from 'react';
import { PaintManager as FabricPaintManager } from 'fabric-layers';
import type { PaintManagerProps } from '../../types';

export const PaintManager: React.FC<PaintManagerProps> = ({
  mode,
  color,
  width,
  onDrawStart,
  onDrawEnd,
  ...options
}) => {
  const managerRef = useRef<FabricPaintManager | null>(null);

  useEffect(() => {
    managerRef.current = new FabricPaintManager({
      mode,
      color,
      width,
      ...options
    });

    if (onDrawStart) {
      managerRef.current.on('drawstart', onDrawStart);
    }
    if (onDrawEnd) {
      managerRef.current.on('drawend', onDrawEnd);
    }

    return () => {
      if (managerRef.current) {
        if (onDrawStart) {
          managerRef.current.off('drawstart', onDrawStart);
        }
        if (onDrawEnd) {
          managerRef.current.off('drawend', onDrawEnd);
        }
        managerRef.current.destroy();
        managerRef.current = null;
      }
    };
  }, [mode, color, width]);

  return null; // Manager component - no direct rendering
};

export default PaintManager;