# Fabric Schematics - Project Plan

## Project Overview

Fabric Schematics is a specialized library for creating schematic and diagram visualizations using Fabric.js as its foundation. The project evolves from fabric-layers-core, focusing on providing advanced grid functionality initially, with plans to expand into a comprehensive diagramming toolkit.

## Transition Process: fabric-layers-core → fabric-schematics

### Phase 1: Core Simplification (Completed)

1. **Code Cleanup**
   - Removed layer-related functionality from `Map.js`
   - Simplified event listeners to focus on grid functionality
   - Removed unused modes (MEASURE, DRAW) from `ModesMixin.js`
   - Streamlined `Constants.js` to reflect simplified functionality

2. **Feature Focus**
   - Maintained core grid functionality
   - Preserved SELECT and GRAB modes for basic interaction
   - Kept utility functions in `/src/lib` for future use

### Phase 2: Project Renaming (Completed)

1. **Package Identification**
   - Renamed project to `fabric-schematics` in package.json
   - Updated description to reflect schematic/diagram visualization focus
   - Added relevant keywords for better discoverability

2. **Global Namespace Update**
   - Changed global JS namespace from `FabricLayers` to `FabricSchematics`
   - Updated all canvas IDs and element references
   - Revised documentation and demo files

### Phase 3: Fabric.js Custom Objects (Current Focus)

1. **Schematic Implementation**
   - Create custom `Schematic` object by extending `fabric.Object` in a new `src/schematic` folder
   - Use adapter pattern to integrate with existing grid functionality
   - Implement `_render(ctx)` to handle grid drawing through the adapter
   - Maintain existing Map class for compatibility while introducing new paradigm

2. **Adapter Pattern Structure**
   - Create clean separation between Fabric.js object model and grid calculations
   - Utilize composition rather than inheritance from existing classes
   - Define clear interfaces between Fabric.js object and underlying grid logic
   - Avoid code duplication by referencing existing utility functions

3. **API Development**
   - Define clear interface for Schematic properties and methods
   - Support standard Fabric.js properties (left, top, width, height, angle)
   - Enable standard Fabric.js events (moving, scaling, rotating)
   - Translate between Fabric.js and grid coordinate systems
   - Address potential rendering performance considerations

### Phase 4: Future Expansion

1. **Additional Components**
   - Markers and connector objects
   - Measurement tools
   - Technical diagramming elements

2. **Enhanced Features**
   - Multi-layer support (reimplemented with Fabric.js object hierarchy)
   - Advanced styling options
   - Import/export capabilities

## Development Workflow

1. **Environment Setup**
   - Use Node.js with nvm for version management
   - Run `nvm i` before any command to ensure correct Node version
   - Use Yarn for package management

2. **Building Process**
   - `nvm i && yarn build` for production build
   - `nvm i && yarn build:watch` for development
   - Rollup and Babel for transpilation

3. **Testing**
   - Karma and Chrome Headless for unit tests
   - Run tests with `nvm i && yarn test`
   - Demo HTML files for manual verification

## API Design Principles

1. **Consistency with Fabric.js**
   - Follow Fabric.js object model and event patterns
   - Use Fabric.js rendering pipeline
   - Support standard Fabric.js interactions

2. **Simplicity and Flexibility**
   - Provide sensible defaults
   - Enable extensive customization options
   - Ensure clean separation of concerns

3. **Performance Optimization**
   - Minimize redraws and calculations
   - Efficient event handling
   - Smart caching where appropriate

## Documentation Strategy

1. **Code Documentation**
   - Clear JSDoc comments for API methods
   - TypeScript definitions for better IDE support

2. **Usage Examples**
   - Demo applications demonstrating key features
   - Code snippets for common use cases

3. **Migration Guide**
   - Instructions for users moving from fabric-layers-core
   - Best practices for implementing with Fabric.js

---

This plan will be updated as the project evolves, with completed milestones marked and new objectives added as needed.