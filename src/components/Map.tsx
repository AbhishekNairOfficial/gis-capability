'use client';

import { useMap } from '@/lib/state/MapContext';
import { useLayerVisibility } from '@/lib/hooks/useLayerVisibility';
import { MapViewState } from '@/lib/state/MapContext';
import { DeckGL } from '@deck.gl/react';
import MapGL from 'react-map-gl/mapbox';
import { ScatterplotLayer, GeoJsonLayer } from '@deck.gl/layers';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import kingCountyVoting from '../data/Voting_Districts_of_King_County___votdst_area.json';

interface MapProps {
  // No props needed as we're using context
}

export default function MapComponent({}: MapProps) {
  const { state, dispatch } = useMap();
  const layers = useLayerVisibility();

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
    // States layer
    new GeoJsonLayer({
      id: 'states',
      // data: statesGeoJson as any,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      lineWidthMinPixels: 2,
      getLineColor: [255, 255, 255],
      getFillColor: [0, 255, 0, 100],
      visible: layers.statePoints
    }),
    // Counties layer
    new GeoJsonLayer({
      id: 'counties',
      data: (kingCountyVoting as any).features,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      lineWidthMinPixels: 2,
      getLineColor: [255, 255, 255],
      getFillColor: [128, 0, 128, 100],
      visible: layers.countyPoints
    }),
    // Detailed points layer
    new ScatterplotLayer({
      id: 'detailed-points',
      data: (kingCountyVoting as any).features,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 6,
      radiusMinPixels: 1,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: (d: any) => {
        const centroid = turf.centroid(d);
        return centroid.geometry.coordinates as [number, number, number];
      },
      getRadius: 10,
      getFillColor: [255, 140, 0],
      getLineColor: [0, 0, 0],
      visible: layers.detailedPoints
    })
  ];

  return (
    <div className="relative w-full h-screen">
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
    </div>
  );
} 