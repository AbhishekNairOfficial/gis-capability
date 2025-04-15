'use client';

import { useState, useCallback } from 'react';
import MapGL from 'react-map-gl/mapbox';
import { NavigationControl } from 'react-map-gl/mapbox';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, PathLayer, GeoJsonLayer } from '@deck.gl/layers';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import { fetchUSA, seattle, olympia } from '@/data/geographicBoundaries';
import usaData from '../data/gz_2010_us_040_00_20m.json';
import kingCountyVoting from '../data/Voting_Districts_of_King_County___votdst_area.json';
import kingCountyFire from '../data/Fire_Protection_Districts_of_King_County___firdst_area.json';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapProps {
  onViewStateChange?: (viewState: any) => void;
  activeLayers?: Record<string, boolean>;
  viewState?: any;
}

export default function Map({ onViewStateChange, activeLayers = { 
  scatterplot: false, 
  path: false,
  states: false,
  counties: false,
  cities: false,
  capitals: false
}, viewState: externalViewState }: MapProps) {
  const [internalViewState, setInternalViewState] = useState({
    longitude: -122.16753150210259,
    latitude: 47.57663821379344,
    zoom: 13,
    pitch: 0,
    bearing: 0
  });

  const viewState = externalViewState || internalViewState;

  const handleViewStateChange = useCallback((evt: any) => {
    setInternalViewState(evt.viewState);
    onViewStateChange?.(evt.viewState);
  }, [onViewStateChange]);

  // Example data points
  const data = [
    { position: [-122.35583410569349, 47.62145071026513], color: [255, 0, 0], radius: 100 },
    { position: [-122.19242892978143, 47.5968740306351], color: [0, 255, 0], radius: 100 },
    { position: [-122.16753150210259, 47.57663821379344], color: [0, 0, 255], radius: 100 }
  ];

  // Create a line between points using turf.js
  const line = turf.lineString(olympia.geometry.coordinates.map(point => point));

  const deckLayers = [
    // States layer
    new GeoJsonLayer({
      id: 'states',
      data: usaData as GeoJSON.FeatureCollection,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      lineWidthMinPixels: 2,
      getLineColor: [255, 255, 255],
      getFillColor: [0, 255, 0, 100],
      visible: activeLayers.states
    }),
    new GeoJsonLayer({
      id: 'countries',
      data: fetchUSA(),
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      lineWidthMinPixels: 2,
      getLineColor: [255, 255, 255],
      getFillColor: [200, 200, 200, 100],
      visible: activeLayers.states
    }),
    // Counties layer
    new GeoJsonLayer({
      id: 'counties',
      data: kingCountyVoting as GeoJSON.FeatureCollection,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      lineWidthMinPixels: 1,
      getLineColor: [255, 255, 255],
      getFillColor: [128, 0, 128, 100],
      visible: activeLayers.counties
    }),
    new GeoJsonLayer({
      id: 'countsies',
      data: kingCountyFire as GeoJSON.FeatureCollection,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      lineWidthMinPixels: 1,
      getLineColor: [255, 255, 255],
      getFillColor: [255, 0, 0, 100],
      visible: activeLayers.counties
    }),
    // Cities layer
    new GeoJsonLayer({
      id: 'cities',
      data: seattle,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      lineWidthMinPixels: 1,
      getLineColor: [255, 255, 255],
      getFillColor: [100, 100, 100, 100],
      visible: activeLayers.cities
    }),
    // State capitals layer
    new GeoJsonLayer({
      id: 'capitals',
      data: olympia,
      pickable: true,
      stroked: true,
      filled: true,
      pointRadiusMinPixels: 5,
      pointRadiusMaxPixels: 10,
      getLineColor: [255, 255, 255],
      getFillColor: [255, 0, 0],
      visible: activeLayers.capitals
    }),
    // Original scatterplot layer
    new ScatterplotLayer({
      id: 'scatterplot',
      data,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 20,
      radiusMinPixels: 5,
      radiusMaxPixels: 20,
      lineWidthMinPixels: 2,
      getPosition: (d: any) => d.position,
      getFillColor: (d: any) => d.color,
      getLineColor: [255, 255, 255],
      visible: activeLayers.scatterplot
    }),
    // Original path layer
    new PathLayer({
      id: 'path',
      data: [line],
      pickable: true,
      widthScale: 20,
      widthMinPixels: 2,
      getPath: (d: any) => d.geometry.coordinates,
      getColor: [255, 0, 0],
      getWidth: 1,
      visible: activeLayers.path
    })
  ];

  return (
    <div className="relative w-full h-screen">
      <DeckGL
        viewState={viewState}
        controller={true}
        layers={deckLayers}
        onViewStateChange={handleViewStateChange}
      >
        <MapGL
          {...viewState}
          onMove={handleViewStateChange}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          <NavigationControl />
        </MapGL>
      </DeckGL>
    </div>
  );
} 