import React, { useEffect, useRef } from 'react';
import { Measurement as FabricMeasurement } from 'fabric-layers';
import type { MeasurementProps } from '../../types';

export const Measurement: React.FC<MeasurementProps> = ({
  unit,
  precision,
  start,
  end,
  style,
  onUpdate,
}) => {
  const measurementRef = useRef<FabricMeasurement | null>(null);

  useEffect(() => {
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

    return () => {
      if (measurementRef.current) {
        if (onUpdate) {
          measurementRef.current.off('update', onUpdate);
        }
        measurementRef.current.destroy();
        measurementRef.current = null;
      }
    };
  }, [start, end, unit, precision, style]);

  return null; // Renders directly on canvas
};

export default Measurement;