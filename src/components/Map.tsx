'use client';

import { useMap } from '@/lib/state/MapContext';
import { useLayerVisibility } from '@/lib/hooks/useLayerVisibility';
import { MapViewState } from '@/lib/state/MapContext';
import { DeckGL } from '@deck.gl/react';
import MapGL from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import Loading from '@/app/loading';
import HoverCard from './hover-card';
import KingCountyHex from './layers/king-county-hex';
import KingCountyGeoJson from './layers/king-county-geojson';
import UsStates from './layers/us-states';
import useDataSetup from '@/lib/hooks/useDataSetup';


interface MapProps {
  // No props needed as we're using context
}

export default function MapComponent({}: MapProps) {
  const { state, dispatch } = useMap();
  const layers = useLayerVisibility();

  const {taxData, colorScale,radiusScale, isLoading} = useDataSetup();

  const [hoverInfo, setHoverInfo] = useState<{x: number, y: number, object: any} | null>(null);
  const [displayValue, setDisplayValue] = useState<number>(0);

  // Update display value with animation when hover info changes
  useEffect(() => {
    if (hoverInfo) {
      const targetValue = hoverInfo.object.elevationValue;
      const startValue = displayValue;
      const duration = 500; // Animation duration in ms
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeProgress = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const currentValue = startValue + (targetValue - startValue) * easeProgress;
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [hoverInfo]);

  const handleViewStateChange = (viewState: MapViewState) => {
    dispatch({
      type: 'SET_VIEW_STATE',
      payload: {
        longitude: viewState.longitude,
        latitude: viewState.latitude,
        zoom: viewState.zoom,
        pitch: viewState.pitch,
        bearing: viewState.bearing
      }
    });
  };

  const deckLayers = [
    // States layer with tax data coloring
    ...(colorScale ? [UsStates({ taxData, colorScale, layers })] : []),
    // Counties layer
    ...(radiusScale ? [KingCountyGeoJson({ layers })] : []),
    // Hexagon layer for voting data
    ...(radiusScale ? [KingCountyHex({ layers, setHoverInfo })] : [])
  ];

  return (
    <div className="relative w-full h-screen">
      {isLoading && <Loading />}
      <DeckGL
        initialViewState={state.viewState}
        viewState={state.viewState}
        onViewStateChange={({ viewState }) => handleViewStateChange(viewState as MapViewState)}
        controller={true}
        layers={deckLayers}
      >
        <MapGL
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        />
      </DeckGL>
      {hoverInfo && <HoverCard hoverInfo={hoverInfo} displayValue={displayValue} />}
    </div>
  );
} 