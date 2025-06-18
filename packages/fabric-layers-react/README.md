# Fabric Layers React

React component library for [fabric-layers](https://github.com/ajoslin103/fabric-layers), providing declarative React components for all fabric-layers classes.

## Structure

The component library mirrors the structure of the original fabric-layers library:

```
Base (EventEmitter2)
├── Map (components/Map/)
│   ├── Grid
│   ├── Point
│   └── Measurement
├── Layer (components/Layers/)
│   ├── Vector Layers
│   │   ├── Line
│   │   ├── Circle
│   │   ├── Rect
│   │   └── Polyline
│   ├── Marker System
│   │   ├── Marker
│   │   ├── MarkerGroup
│   │   └── Icon
│   ├── Group
│   ├── Connector
│   └── Tooltip
├── Paint System (components/Paint/)
│   ├── Canvas
│   ├── Arrow
│   ├── ArrowHead
│   └── PaintManager
└── Measurement System (components/Measurement/)
    ├── Measurement
    └── Measurer
```

## Installation

```bash
npm install fabric-layers-react fabric-layers
# or
yarn add fabric-layers-react fabric-layers
```

## Usage

Here's a comprehensive example using various components:

```tsx
import { Map } from 'fabric-layers-react';
import { Circle, Line, Marker } from 'fabric-layers-react/components/Layers';
import { Arrow, PaintManager } from 'fabric-layers-react/components/Paint';
import { Measurement, Measurer } from 'fabric-layers-react/components/Measurement';

function MyMap() {
  return (
    <Map width={800} height={600}>
      {/* Vector layer */}
      <Circle
        position={{ x: 100, y: 100 }}
        radius={50}
        style={{ fill: 'blue' }}
      />

      {/* Marker with tooltip */}
      <Marker
        position={{ x: 200, y: 200 }}
        icon={{ url: 'marker.png' }}
        tooltip="Location"
      />

      {/* Arrow with custom head */}
      <Arrow
        start={{ x: 0, y: 0 }}
        end={{ x: 100, y: 100 }}
        headSize={15}
        style={{ stroke: 'red' }}
      />

      {/* Distance measurement */}
      <Measurement
        start={{ x: 50, y: 50 }}
        end={{ x: 150, y: 150 }}
        unit="px"
        precision={2}
      />

      {/* Paint manager for drawing */}
      <PaintManager
        mode="brush"
        color="#000"
        width={2}
        onDrawEnd={handleDrawEnd}
      />

      {/* Measurement tool */}
      <Measurer
        mode="distance"
        unit="px"
        onMeasureEnd={handleMeasurement}
      />
    </Map>
  );
}
```

## Component Reference

### Map Components

- **Map**: Main container component
  ```tsx
  <Map 
    width={800} 
    height={600}
    gridVisible={true}
  />
  ```

### Layer Components

#### Vector Layers

- **Circle**, **Line**, **Rect**, **Polyline**
  ```tsx
  <Circle
    position={{ x: 100, y: 100 }}
    radius={50}
    style={{ fill: 'blue' }}
  />
  ```

#### Marker System

- **Marker**, **MarkerGroup**, **Icon**
  ```tsx
  <Marker
    position={{ x: 200, y: 200 }}
    icon={{
      url: 'marker.png',
      width: 32,
      height: 32
    }}
    tooltip="Location"
  />
  ```

### Paint System

- **Canvas**: Base painting canvas
  ```tsx
  <Canvas
    width={800}
    height={600}
    backgroundColor="#fff"
    onModified={handleModified}
  />
  ```

- **Arrow**: Directional arrow
  ```tsx
  <Arrow
    start={{ x: 0, y: 0 }}
    end={{ x: 100, y: 100 }}
    headSize={10}
    style={{ stroke: 'black' }}
  />
  ```

- **ArrowHead**: Custom arrow head
  ```tsx
  <ArrowHead
    position={{ x: 100, y: 100 }}
    angle={45}
    size={10}
    style={{ fill: 'black' }}
  />
  ```

- **PaintManager**: Drawing tool manager
  ```tsx
  <PaintManager
    mode="brush"
    color="#000"
    width={2}
    onDrawStart={handleDrawStart}
    onDrawEnd={handleDrawEnd}
  />
  ```

### Measurement System

- **Measurement**: Distance/area display
  ```tsx
  <Measurement
    start={{ x: 0, y: 0 }}
    end={{ x: 100, y: 100 }}
    unit="px"
    precision={2}
    onUpdate={handleUpdate}
  />
  ```

- **Measurer**: Interactive measurement tool
  ```tsx
  <Measurer
    mode="distance"
    unit="px"
    precision={2}
    onMeasureStart={handleStart}
    onMeasureEnd={handleEnd}
  />
  ```

## TypeScript Support

All components include comprehensive TypeScript definitions. Key types include:

```typescript
interface Point {
  x: number;
  y: number;
}

interface StyleProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}

// See types/ directory for complete type definitions
```

## Contributing

PRs and issues are welcome!
1. Fork & `git clone`
2. `npm install`
3. Make your changes
4. Add/update tests in `test/`
5. `npm test`

## License

MIT © 2025