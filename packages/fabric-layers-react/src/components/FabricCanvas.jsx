import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric-pure-browser';
import { Map } from 'fabric-layers-core';

export const FabricCanvas = ({ width = 800, height = 600, options = {}, onReady }) => {
  const canvasRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      ...options
    });

    // Create map instance
    mapRef.current = new Map({
      canvas
    });

    // Call onReady with the map instance
    if (onReady) {
      onReady(mapRef.current);
    }

    // Cleanup
    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [width, height, options, onReady]);

  return (
    <canvas ref={canvasRef} />
  );
};

export default FabricCanvas;