import React from 'react';
import { FabricCanvas } from '../../src/components';
import './App.css';

function App() {
  const handleCanvasReady = (map) => {
    console.log('Canvas is ready!', map);
    
    // Example: Add a grid
    map.addGrid({
      size: 50,
      opacity: 0.5
    });
  };

  return (
    <div className="App">
      <h1>Fabric Layers React Example</h1>
      <div className="canvas-container">
        <FabricCanvas
          width={800}
          height={600}
          onReady={handleCanvasReady}
          options={{
            backgroundColor: '#f0f0f0'
          }}
        />
      </div>
    </div>
  );
}

export default App;