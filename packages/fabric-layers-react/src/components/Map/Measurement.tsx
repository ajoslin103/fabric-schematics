import React, { useEffect, useRef } from 'react';
import { Measurement as FabricMeasurement, Map as CoreMap } from 'fabric-layers';

export interface MeasurementProps {
  unit?: string;
  precision?: number;
  start: { x: number; y: number };
  end: { x: number; y: number };
  style?: any;
  onUpdate?: (measurement: any) => void;
  map: CoreMap | null;
}

export const Measurement: React.FC<MeasurementProps> = ({
  unit,
  precision,
  start,
  end,
  style,
  onUpdate,
  map,
}) => {
  const measurementRef = useRef<FabricMeasurement | null>(null);

  useEffect(() => {
    if (!map) return;

    measurementRef.current = new FabricMeasurement({
      unit,
      precision,
      start,
      end,
      style,
    });

    if (onUpdate) {
      measurementRef.current.on('update', onUpdate);
    }

    map.addMeasurement(measurementRef.current);

    return () => {
      if (map && measurementRef.current) {
        if (onUpdate) {
          measurementRef.current.off('update', onUpdate);
        }
        map.removeMeasurement(measurementRef.current);
        measurementRef.current.destroy();
        measurementRef.current = null;
      }
    };
  }, [map, start, end, unit, precision, style, onUpdate]);

  return null;
};

export default Measurement;
