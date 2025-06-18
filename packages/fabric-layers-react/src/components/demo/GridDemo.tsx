import React, { useState, useCallback } from 'react';
import { Map } from '../Map';
import styled from '@emotion/styled';

const DemoContainer = styled.div`
  margin: 0;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const CanvasContainer = styled.div`
  border: 1px solid #ccc;
  margin: 20px 0;
  width: 800px;
  height: 600px;
  background: #f8f9fa;
`;

const Controls = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 16px;
  margin-right: 10px;
  cursor: pointer;
`;

const Label = styled.label`
  margin-right: 10px;
`;

const Input = styled.input`
  width: 70px;
`;

const MonospaceText = styled.span`
  font-family: monospace;
  margin-left: 20px;
`;

export const GridDemo: React.FC = () => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(0.05);
  const [maxZoom, setMaxZoom] = useState(20);
  const [mapInstance, setMapInstance] = useState<any>(null);

  const handleMapReady = useCallback((map: any) => {
    setMapInstance(map);

    map.on('mouse:move', (e: any) => {
      if (e && e.pointer) {
        setCoordinates({
          x: e.pointer.x,
          y: e.pointer.y
        });
      }
    });

    map.on('mouse:out', () => {
      setCoordinates({ x: 0, y: 0 });
    });

    map.on('update', () => {
      setZoom(map.zoom || 1);
    });

    // Debug events
    map.on('mouse:down', (e: any) => {
      if (e && e.pointer) {
        console.log('mouse:down', e.pointer);
      }
    });

    map.on('mouse:up', (e: any) => {
      if (e && e.pointer) {
        console.log('mouse:up', e.pointer);
      }
    });

    map.on('mouse:dblclick', (e: any) => {
      if (e && e.pointer) {
        console.log('mouse:dblclick', e.pointer);
      }
    });
  }, []);

  const handleMinZoomChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setMinZoom(value);
      if (mapInstance) {
        mapInstance.minZoom = value;
        if (mapInstance.zoom < value) {
          mapInstance.setZoom(value);
        }
      }
    }
  }, [mapInstance]);

  const handleMaxZoomChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > minZoom) {
      setMaxZoom(value);
      if (mapInstance) {
        mapInstance.maxZoom = value;
        if (mapInstance.zoom > value) {
          mapInstance.setZoom(value);
        }
      }
    }
  }, [mapInstance, minZoom]);

  const handleResetView = useCallback(() => {
    if (mapInstance && mapInstance.reset) {
      mapInstance.reset();
    }
  }, [mapInstance]);

  return (
    <DemoContainer>
      <h1>fabric-layers Grid Demo</h1>
      
      <Controls>
        <Label>
          Min Zoom:
          <Input
            type="number"
            step="0.01"
            value={minZoom}
            onChange={handleMinZoomChange}
          />
        </Label>
        
        <Label>
          Max Zoom:
          <Input
            type="number"
            step="0.01"
            value={maxZoom}
            onChange={handleMaxZoomChange}
          />
        </Label>
        
        <Button onClick={handleResetView}>
          Reset View
        </Button>
        
        <MonospaceText>
          X: {coordinates.x.toFixed(1)}, Y: {coordinates.y.toFixed(1)}
        </MonospaceText>
        
        <MonospaceText>
          Zoom: {zoom.toFixed(2)}x
        </MonospaceText>
      </Controls>

      <CanvasContainer>
        <Map
          width={800}
          height={600}
          onReady={handleMapReady}
          defaultMode="GRAB"
        />
      </CanvasContainer>
    </DemoContainer>
  );
};

export default GridDemo;