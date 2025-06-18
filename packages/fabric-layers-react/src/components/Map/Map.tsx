import React, { useEffect, useRef, useState } from 'react';
import { Map as FabricMap } from 'fabric-layers';
import type { Map as CoreMap } from 'fabric-layers';

export interface MapProps {
  width?: number | string;
  height?: number | string;
  initialMode?: string;
  defaultMode?: string;
  onReady?: (map: CoreMap) => void;
  children?: React.ReactNode;
  onModeChange?: (mode: string) => void;
}

export const Map: React.FC<MapProps> = ({
  width = '100%',
  height = '100%',
  initialMode = 'default',
  defaultMode,
  onReady,
  children,
  onModeChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMapInstance] = useState<CoreMap | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const mapInstance = new FabricMap(containerRef.current);
    setMapInstance(mapInstance);
    
    if (onReady) {
      onReady(mapInstance);
    }

    // Register default mode if needed
    const mode = defaultMode || initialMode;
    if (mode !== 'default') {
      mapInstance.registerMode(mode, {});
      mapInstance.setMode(mode);
    }

    return () => {
      if (mapInstance) {
        mapInstance.dispose();
      }
    };
  }, [initialMode, defaultMode, onReady]);

  useEffect(() => {
    if (!map || !onModeChange) return;

    const handleModeChange = (mode: string) => {
      onModeChange(mode);
    };

    map.registerEventListener('modeChange', handleModeChange);

    return () => {
      map.unregisterEventListener('modeChange', handleModeChange);
    };
  }, [map, onModeChange]);

  return (
    <div ref={containerRef} style={{ width, height }}>
      {map && children}
    </div>
  );
};

export default Map;