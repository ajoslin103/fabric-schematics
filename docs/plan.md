# Fabric Schematics - Single-Goal Project Plan

## Primary Goal

Transform the existing `src/map/Map.js` class into a Fabric.js custom object in `src/schematic`.

## Implementation Process

1. **Create Schematic Class**
   - Create new file structure in `src/schematic/`
   - Create `Schematic.js` that extends `fabric.Object`
   - Set up required Fabric.js object properties and methods

2. **Code Migration**
   - Copy core functionality from `Map.js` to `Schematic.js`
   - Modify to work within Fabric.js object lifecycle
   - Implement `_render(ctx)` method for Fabric.js rendering

3. **Grid Integration**
   - Preserve grid drawing and calculation functionality
   - Ensure grid properly scales with Fabric.js transformations
   - Maintain zoom, pan and interactive features

4. **Fabric.js Compatibility**
   - Support standard object properties (left, top, width, height, angle)
   - Implement object controls for resizing and rotation
   - Ensure compatibility with canvas selection and active object handling

## Technical Tasks

1. **Create Basic Structure**
   ```javascript
   fabric.Schematic = fabric.util.createClass(fabric.Object, {
     // Copy relevant properties and methods from Map.js
     // Implement required Fabric.js object methods
   });
   ```

2. **Port Core Functions**
   - Copy grid rendering logic
   - Adapt zoom and pan functionality
   - Convert coordinate systems where needed

3. **Test Integration**
   - Create test file to verify object rendering
   - Verify interactions work properly
   - Ensure serialization/deserialization works

## Development Environment

- Run `nvm i` before any command to ensure correct Node version
- Use Yarn for package management
- Build with `nvm i && yarn build` or `nvm i && yarn build:watch`

---

This focused plan addresses our single goal of converting the Map class to a Fabric.js custom object.