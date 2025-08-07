# Map Object - Current State and Goals

## Current State (150 words)

The Map class is a standalone canvas controller that manages a native HTML5 canvas element with Grid rendering capabilities. It directly extends Base and delegates mode management to its MapState instance. The class creates a single canvas element and connects a Grid instance to this canvas when addGrid() is called.

Map handles viewport interactions through an integrated panzoom library, managing zoom levels, pan operations, and coordinate transformations. It maintains its own coordinate system with configurable center point and zoom level. The class provides methods for origin pinning (setOriginPin) and margin configuration (setPinMargin) that are passed to the Grid when present.

The implementation is purely canvas-based with no Fabric.js integration. Map updates Grid by passing its current center, zoom, and size parameters. It manages cursor styles based on interaction modes and emits events for state changes including 'ready', 'update', and 'panning'. 

Map handles DOM lifecycle including canvas creation, container management, window resize events, and cleanup.

## Goals (50 words)

Transform the canvas-based Map controller into a proper fabric.js custom object (similar to the Schematic class). The implementation should maintain all current functionality, integrate Grid rendering directly with fabric.js, support standard fabric.js object behaviors, and provide clean serialization. This will enable full integration with the fabric.js ecosystem.