# Schematic Object - Current State and Goals

## Current State (100 words)

The Schematic object is a Fabric.js custom object that acts as a view controller for the existing Grid class. It extends `fabric.Object` and manages a Grid instance that shares the same canvas element as the Fabric.js canvas. During the `_render` method, the Schematic updates the Grid state and lets Grid draw directly to the canvas without context manipulation. This approach preserves all Grid functionality (coordinate calculations, line drawing, labels, ticks) while integrating with the Fabric.js object lifecycle. The Schematic handles state synchronization between Fabric.js properties (zoom, center, dimensions) and Grid settings (origin pin, margins, zoom behavior), passing the Fabric.js HTML canvas element to Grid during initialization.

## Goals (50 words)

Transform the Map.js class into a proper Fabric.js custom object that leverages the existing Grid class for calculations and rendering. Maintain all Grid functionality while providing standard Fabric.js object behavior including selection, transformation, serialization, and canvas integration. Achieve clean separation between grid logic and Fabric.js view management.
