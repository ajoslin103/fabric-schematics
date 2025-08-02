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
   - Modify to work within Fabric.js object lifecycle and use Fabric.js practices throughout
   - Implement `_render(ctx)` method for Fabric.js rendering
   - Replace all non-Fabric.js canvas operations with Fabric.js equivalents

3. **Grid Integration Using Fabric.js Best Practices**
   - Use existing Grid class instance within Schematic for grid calculations and state
   - Schematic acts as a view controller managing Grid instance and handling state
   - Grid renders directly to Fabric.js context in Schematic's `_render` method
   - Maintain Grid's existing functionality while integrating with Fabric.js lifecycle

- Run `nvm i` before any command to ensure correct Node version
- Use Yarn for package management
- Build with `nvm i && yarn build` or `nvm i && yarn build:watch`

---

This focused plan addresses our single goal of converting the Map class to a Fabric.js custom object.
