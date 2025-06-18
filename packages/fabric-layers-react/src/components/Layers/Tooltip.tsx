import React, { useEffect, useRef } from 'react';
import { Tooltip as FabricTooltip } from 'fabric-layers/layer';
import type { TooltipProps } from '../../types';

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position,
  style,
  ...options
}) => {
  const tooltipRef = useRef<FabricTooltip | null>(null);

  useEffect(() => {
    tooltipRef.current = new FabricTooltip({
      content,
      position,
      style,
      ...options
    });

    return () => {
      if (tooltipRef.current) {
        tooltipRef.current.destroy();
        tooltipRef.current = null;
      }
    };
  }, [content, position, style]);

  return null; // Renders directly on canvas
};

export default Tooltip;