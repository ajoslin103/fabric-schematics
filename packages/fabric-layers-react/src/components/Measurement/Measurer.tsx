import React, { useEffect, useRef } from 'react';
import { Measurer as FabricMeasurer } from 'fabric-layers/measurement';
import type { MeasurerProps } from '../../types';

export const Measurer: React.FC<MeasurerProps> = ({
  mode = 'distance',
  unit = 'px',
  precision = 2,
  onMeasureStart,
  onMeasureEnd,
  ...options
}) => {
  const measurerRef = useRef<FabricMeasurer | null>(null);

  useEffect(() => {
    measurerRef.current = new FabricMeasurer({
      mode,
      unit,
      precision,
      ...options
    });

    if (onMeasureStart) {
      measurerRef.current.on('measurestart', onMeasureStart);
    }
    if (onMeasureEnd) {
      measurerRef.current.on('measureend', onMeasureEnd);
    }

    return () => {
      if (measurerRef.current) {
        if (onMeasureStart) {
          measurerRef.current.off('measurestart', onMeasureStart);
        }
        if (onMeasureEnd) {
          measurerRef.current.off('measureend', onMeasureEnd);
        }
        measurerRef.current.destroy();
        measurerRef.current = null;
      }
    };
  }, [mode, unit, precision]);

  return null; // Manager component - no direct rendering
};

export default Measurer;