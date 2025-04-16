import { useEffect } from 'react';
import { useMap } from '../state/MapContext';

const ZOOM_LEVELS = {
  STATE_LEVEL: 4,
  COUNTY_LEVEL: 9,
  DETAILED_LEVEL: 12,
};

export function useLayerVisibility() {
  const { state, dispatch } = useMap();
  const { zoom } = state.viewState;

  useEffect(() => {
    const updateLayers = () => {
      const newLayers = {
        statePoints: ZOOM_LEVELS.STATE_LEVEL < zoom && zoom < ZOOM_LEVELS.COUNTY_LEVEL,
        countyPoints: zoom >= ZOOM_LEVELS.COUNTY_LEVEL && zoom < ZOOM_LEVELS.DETAILED_LEVEL,
        detailedPoints: zoom >= ZOOM_LEVELS.DETAILED_LEVEL,
      };

      // Only update if there are changes
      if (JSON.stringify(newLayers) !== JSON.stringify(state.layers)) {
        Object.entries(newLayers).forEach(([layer, isVisible]) => {
          if (state.layers[layer as keyof typeof state.layers] !== isVisible) {
            dispatch({ type: 'TOGGLE_LAYER', payload: layer as keyof typeof state.layers });
          }
        });
      }
    };

    updateLayers();
  }, [zoom, state.layers, dispatch]);

  return state.layers;
} 