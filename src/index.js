/**
 * fabric-schematics - A schematic and diagram visualization library for fabric.js
 * Main entry point that re-exports core grid functionality
 */

import { version } from '../package.json';

// Export version info
export { version };

// Log version info if in browser environment
if (typeof window !== 'undefined') {
  console.log('fabric-schematics ', version);
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
  const oldFabricSchematics = window.FabricSchematics;
  
  // Create namespace
  window.FabricSchematics = allExports;
  
  // Provide noConflict method
  window.FabricSchematics.noConflict = function() {
    window.FabricSchematics = oldFabricSchematics;
    return this;
  };
}

export default allExports;