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

// Ensure a valid baseline is used by all Fabric text instances
try {
  if (fabric && fabric.Text && fabric.Text.prototype) {
    fabric.Text.prototype.textBaseline = 'alphabetic';

    // Harden: ensure canvas context baseline is valid inside Fabric's pipeline
    const proto = fabric.Text.prototype;
    const original = proto._setTextStyles;
    if (typeof original === 'function') {
      proto._setTextStyles = function(ctx) {
        try { ctx.textBaseline = 'alphabetic'; } catch (_) {}
        const ret = original.call(this, ctx);
        // Some Fabric versions may mutate ctx again; enforce after call too
        try { ctx.textBaseline = 'alphabetic'; } catch (_) {}
        return ret;
      };
    }
  }
} catch (_) {
  // ignore if fabric is not available yet
}
