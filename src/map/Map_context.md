# Map Object - Current State and Goals

## Current State (180 words)

The Map class is a standalone canvas controller that manages a native HTML5 canvas element with Grid rendering overlay. It extends Base through a mixin architecture, incorporating ModesMixin for interaction mode management (select/grab). The class creates a single canvas element and delegates grid rendering to a separate Grid instance that shares the same canvas.

Map handles all viewport interactions through an integrated panzoom library, managing zoom levels, pan operations, and coordinate transformations. It maintains its own coordinate system with configurable center point, zoom level, and origin positioning. The class supports advanced features like origin pinning to canvas corners, configurable pin margins, and mouse-following zoom behavior.

The rendering architecture is purely canvas-based with no Fabric.js integration. Map coordinates Grid updates by passing its current center, zoom, and size parameters. It manages cursor styles based on interaction modes and emits events for state changes including updates and panning operations.

Map handles DOM lifecycle including canvas creation, container management, window resize events, and cleanup. The implementation is streamlined for grid-only rendering without object management capabilities.

## Goals (50 words)

Transform the canvas-based Map controller into a proper Fabric.js custom object while maintaining all current functionality. The new implementation should integrate Grid rendering directly into Fabric.js object lifecycle, support standard object behaviors including selection and transformation, and provide clean serialization for saving/restoring states.
