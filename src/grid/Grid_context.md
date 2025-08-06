# Grid Object - Current State and Goals

## Current State
The Grid class has been refactored to separate pure calculation functions from rendering logic. Core mathematical calculations are now housed in `../lib/grid-calcs.js`, implementing a functional approach with pure functions like `calculatePinnedX`, `calculatePinnedY`, `calculateCenterCoords`, `calculateCoordinateState`, `calculateNormalVectors`, `calculateTickCoords`, and `calculateLabelPosition`. This separation improves maintainability, testability, and code organization.

The Grid class itself remains responsible for canvas rendering and event handling, but now delegates complex calculations to imported pure functions. It accepts an HTML canvas element in its constructor and maintains control over the 2D rendering context while emitting events for state changes. Grid maintains internal state objects for both X and Y axes with cross-references through state.opposite.

Origin pinning functionality (`setOriginPin`, `setPinMargin`) allows grid corners to be locked during transformations. The rendering pipeline consists of update methods for coordinate state recalculation, a `draw` method that orchestrates rendering, and specialized rendering methods (`drawLines`, `drawLabels`). The class has been hardened against edge cases with robust null checking to prevent runtime errors.


## Goals (50 words)

Maintain Grid as a pure calculation and rendering engine without Fabric.js dependencies. Preserve existing functionality while remaining compatible with context swapping integration patterns. Keep Grid focused on coordinate mathematics, line drawing, and axis management without coupling to specific canvas implementations or rendering frameworks.