/**
 * Debug flags for different parts of the application
 * Set flags to true to enable debugging for specific components
 */

// State management debugging
export const DEBUG = {
  // Core state transitions and operations
  STATE: {
    GENERAL: false,      // General state operations
    PANZOOM: false,      // Pan and zoom state changes
    DIMENSIONS: false,   // Canvas dimension changes
    POSITION: false,     // Position and coordinate changes
    MODE: false          // Mode changes (select/grab)
  },

  // Map component debugging
  MAP: {
    GENERAL: false,      // General map operations
    PANZOOM: false,      // Pan and zoom operations
    MIRRORING: false,    // State mirroring operations
    RENDER: false,       // Rendering and updates
    TIMESTAMP: false     // Timestamp-related operations
  },

  // Grid component debugging
  GRID: {
    GENERAL: false,      // General grid operations
    RENDER: false        // Grid rendering
  },

  // Event system debugging
  EVENTS: {
    GENERAL: false,      // General event debugging
    EMITTER: false       // EventEmitter2 events
  }
};

// Helper function to check if debugging is enabled for a category
export const isDebugEnabled = (category, subcategory) => {
  return DEBUG[category] && DEBUG[category][subcategory];
};