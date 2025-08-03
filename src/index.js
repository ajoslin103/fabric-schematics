/**
 * fabric-schematics - A schematic and diagram visualization library for fabric.js
 * Main entry point that re-exports core functionality and custom objects
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

// Schematic components
export * from './schematic/index';

// Import what we need for the browser
import { Map } from './map/Map';
import { OriginPin } from './core/Constants';
import Schematic from './schematic/Schematic';

// Collect all exports
const allExports = {
  version,
  Map,
  OriginPin,
  Schematic
};

// If we're in a browser environment, add to global scope
// But provide a noConflict method
if (typeof window !== 'undefined') {
  const oldFabricSchematics = window.FabricSchematics;
  
  // Create namespace
  window.FabricSchematics = allExports;
  
  // Explicitly register Schematic class on fabric object
  if (window.fabric) {
    fabric.Schematic = Schematic;
    fabric.Schematic.fromObject = Schematic.fromObject;
  }
  
  // Provide noConflict method
  window.FabricSchematics.noConflict = function() {
    window.FabricSchematics = oldFabricSchematics;
    return this;
  };
  
  // Log registration
  console.log('FabricSchematics registered with components:', Object.keys(allExports));
}

export default allExports;