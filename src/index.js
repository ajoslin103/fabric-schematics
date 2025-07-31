/**
 * fabric-layers - A fabric.js coordinate-plane (grid) library
 * Main entry point that re-exports core grid functionality
 */

import { version } from '../package.json';

// Export version info
export { version };

// Log version info if in browser environment
if (typeof window !== 'undefined') {
  console.log('fabric-layers-core ', version);
}

// Core components
export * from './core/index';

// Geometry utilities
export * from './geometry/index';

// Map components
export * from './map/index';

// Grid system
export * from './grid/index';

// Import what we need for the browser
import { Map } from './map/Map';
import { OriginPin } from './core/Constants';

// Collect all exports
const allExports = {
  version,
  Map,
  OriginPin
};

// If we're in a browser environment, add to global scope
// But provide a noConflict method
if (typeof window !== 'undefined') {
  const oldFabricLayers = window.FabricLayers;
  
  // Create namespace
  window.FabricLayers = allExports;
  
  // Provide noConflict method
  window.FabricLayers.noConflict = function() {
    window.FabricLayers = oldFabricLayers;
    return this;
  };
}

export default allExports;