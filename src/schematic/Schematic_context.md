# Schematic Object - Current State and Goals

## Current State (100 words)

The Schematic object is a Fabric.js custom object that acts as a view controller for the existing Grid class. It extends `fabric.Object` and manages a Grid instance through context swapping during rendering. The implementation creates a virtual canvas for Grid calculations while temporarily replacing the Grid's context with Fabric.js context during the `_render` method. This approach preserves all Grid functionality (coordinate calculations, line drawing, labels, ticks) while integrating seamlessly with Fabric.js object lifecycle. The Schematic handles state synchronization between Fabric.js properties (zoom, center, dimensions) and Grid settings (origin pin, margins, zoom behavior). Grid renders directly to Fabric.js context without modification.

## Goals (50 words)

Transform the Map.js class into a proper Fabric.js custom object that leverages the existing Grid class for calculations and rendering. Maintain all Grid functionality while providing standard Fabric.js object behavior including selection, transformation, serialization, and canvas integration. Achieve clean separation between grid logic and Fabric.js view management.
