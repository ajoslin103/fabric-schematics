import React, { useRef } from 'react';
import { Map, Grid, Point } from '../src';
import { Map as CoreMap } from 'fabric-layers';

const App = () => {
  const mapRef = useRef<CoreMap>(null);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, border: '1px solid #ddd' }}>
        <Map 
          ref={mapRef}
          style={{ width: '100%', height: '100%' }}
          onReady={(map) => {
            console.log('Map is ready:', map);
          }}
        >
          <Grid size={50} color="#ccc" />
          <Point x={100} y={100} radius={10} fill="red" />
          <Point x={200} y={200} radius={10} fill="blue" />
        </Map>
      </div>
    </div>
  );
};

export default App;