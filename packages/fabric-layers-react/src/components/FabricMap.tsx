import * as React from 'react';
import { createContext, useContext, useRef, useEffect, ReactNode } from 'react';
import * as FabricLayers from 'fabric-layers-core';

interface FabricMapProps {
  width?: number;
  height?: number;
  children?: ReactNode;
}

const FabricContext = createContext<FabricLayers.Map | null>(null);

export const FabricMap: React.FC<FabricMapProps> = ({ width = 800, height = 600, children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<FabricLayers.Map | null>(null);

  useEffect(() => {
    if (containerRef.current && !mapRef.current) {
      mapRef.current = new FabricLayers.Map(containerRef.current, {
        width,
        height,
        showGrid: true,
        mode: 'GRAB'
      });
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.dispose();
      }
    };
  }, []);

  return React.createElement(
    FabricContext.Provider,
    { value: mapRef.current },
    React.createElement('div', { ref: containerRef }),
    children
  );
};

export const useFabricMap = () => useContext(FabricContext);
