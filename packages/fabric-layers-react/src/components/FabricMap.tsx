import { createContext, useContext, useRef, useEffect } from 'react';
import * as FabricLayers from 'fabric-layers-core';

const FabricContext = createContext(null);

export const FabricMap = ({ width = 800, height = 600, children }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !mapRef.current) {
      mapRef.current = new FabricLayers.Map(containerRef.current, {
        width,
        height,
        showGrid: true,
        mode: 'GRAB'
      });
    }
    return () => mapRef.current?.dispose();
  }, []);

  return (
    <FabricContext.Provider value={mapRef.current}>
      <div ref={containerRef} />
      {children}
    </FabricContext.Provider>
  );
};

export const useFabricMap = () => useContext(FabricContext);
