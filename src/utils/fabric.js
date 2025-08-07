/**
 * fabric.js
 * Utility file for fabric.js references
 * 
 * This provides a consistent way to reference the globally loaded fabric object
 * that is loaded from CDN in browser environments.
 */

// For browser environments, fabric is available globally
// For Node.js/test environments, fabric is imported
let fabricObj = {};

if (typeof window !== 'undefined' && window.fabric) {
  fabricObj = window.fabric;
} else if (typeof global !== 'undefined' && global.fabric) {
  fabricObj = global.fabric;
}

// Re-export fabric
export const fabric = fabricObj;

export function canvasIsFabricCanvas(canvasElement) {
  return !!canvasElement?.['absolutePan'];
}
