# MapState.js Context

MapState.js (356 lines) serves as the state management system for the map component, extending EventEmitter2 to provide an event-driven architecture. It maintains view state properties including zoom level, coordinates, dimensions, and interaction modes.

## Key Dependencies
- EventEmitter2: Used for state change notifications
- Point: Geometric data structure from `../geometry/Point`
- MAP/Modes/OriginPin constants: Configuration values from `../core/Constants`
- mumath: Utility functions for mathematical operations

## Core Functionality
The class manages viewport transformations (pan/zoom), coordinates systems, and interaction modes (select/grab). Each state change emits corresponding events, allowing components to react to state updates.

## Notable Features
- Comprehensive state serialization via toJSON/fromJSON
- Event-based change notifications for fine-grained updates
- Mouse-relative or center-relative zooming

## Potential Gotchas
1. Multiple coordinate systems (center point and x,y coordinates) that need coordination
2. Complex panzoom event processing with multiple state updates
3. Pinning behavior that depends on origin points and margins
4. Timestamp tracking that might affect rendering performance
