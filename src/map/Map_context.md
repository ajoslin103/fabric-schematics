# Map Object - Current State and Goals

## Current State (175 words)

The Map class is a central controller component that manages a Fabric.js canvas and Grid rendering system. It creates and owns both the primary Fabric.js canvas and a separate grid canvas that overlay each other. Built with a mixin architecture, it incorporates mode management (select/grab) through ModesMixin. The class handles pan/zoom interactions via an external panzoom library, translating those inputs into viewport transformations and Grid state updates.

Map maintains coordinate system synchronization between Fabric.js absolute coordinates and Grid's internal coordinate system. It supports features like origin pinning, zoom limits, and mouse-following zoom behavior. For viewport management, Map implements methods for bounds calculation, canvas resizing, and position resets.

The rendering pipeline consists of Fabric.js standard rendering with additional Grid updates. During updates, Map synchronizes Grid with its own center and zoom values, handles object scaling for zoom-independent elements, and manages cursor styles based on interaction modes.

Map emits events for key state changes including updates, panning, and component-specific scaling. It directly manages its container's DOM structure, positioning multiple canvases for proper layering and interaction handling.

## Goals (50 words)

Transform the standalone Map controller into a proper Fabric.js custom object while maintaining all current functionality. The new implementation should integrate Grid rendering directly into Fabric.js object lifecycle, support standard object behaviors including selection and transformation, and provide clean serialization for saving/restoring states.
