import React, { useEffect, useRef } from 'react';
import { Connector as FabricConnector } from 'fabric-layers/layer';
import type { ConnectorProps } from '../../types';

export const Connector: React.FC<ConnectorProps> = ({
  start,
  end,
  style,
  onSelect,
  ...options
}) => {
  const connectorRef = useRef<FabricConnector | null>(null);

  useEffect(() => {
    connectorRef.current = new FabricConnector({
      start,
      end,
      style,
      ...options
    });

    if (onSelect) {
      connectorRef.current.on('select', onSelect);
    }

    return () => {
      if (connectorRef.current) {
        if (onSelect) {
          connectorRef.current.off('select', onSelect);
        }
        connectorRef.current.destroy();
        connectorRef.current = null;
      }
    };
  }, [start, end, style]);

  return null; // Renders directly on canvas
};

export default Connector;