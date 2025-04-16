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
import statesGeoJson from '../data/us-states-geojson.json';
import { fetchTaxData } from '@/app/actions/taxData';
import React, { useEffect, useState } from 'react';

interface TaxData {
  state_name: string;
  total: number;
}

interface MapProps {
  // No props needed as we're using context
}

// Color scale function
function createColorScale(min: number, max: number) {
  return (value: number): [number, number, number, number] => {
    // Use logarithmic scale for better distribution
    const logMin = Math.log10(min);
    const logMax = Math.log10(max);
    const logValue = Math.log10(value);
    const normalized = (logValue - logMin) / (logMax - logMin);
    
    // Create a gradient from very light blue to deep blue
    // Start: Very Light Blue (230, 240, 255)
    // End: Deep Blue (0, 0, 139)
    const r = Math.floor(230 * (1 - normalized));
    const g = Math.floor(240 * (1 - normalized));
    const b = Math.floor(139 + (255 - 139) * (1 - normalized));
    
    return [r, g, b, 255]; // Full opacity
  };
}

export default function MapComponent({}: MapProps) {
  const { state, dispatch } = useMap();
  const layers = useLayerVisibility();
  const [taxData, setTaxData] = useState<TaxData[]>([]);
  const [colorScale, setColorScale] = useState<((value: number) => [number, number, number, number]) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTaxData() {
      try {
        const data = await fetchTaxData();
        console.log('Loaded tax data:', data);
        setTaxData(data);
        
        // Calculate min and max values for the color scale
        const totals = data.map(item => item.total);
        const min = Math.min(...totals);
        const max = Math.max(...totals);
        
        console.log('Tax data range:', { min, max, data: data.map(d => ({ state: d.state_name, total: d.total })) });
        
        // Create color scale function
        setColorScale(() => createColorScale(min, max));
      } catch (error) {
        console.error('Error loading tax data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadTaxData();
  }, []);

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
    ...(colorScale ? [new GeoJsonLayer({
      id: 'states',
      data: statesGeoJson as any,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      lineWidthMinPixels: 1,
      getLineColor: [255, 255, 255],
      getFillColor: (feature: any) => {
        const stateName = feature.properties.NAME;
        // console.log('Processing state:', stateName);
        
        const taxInfo = taxData.find(item => {
          const match = item.state_name.toLowerCase() === stateName.toLowerCase();
          // console.log(`Comparing: ${item.state_name} with ${stateName}`, match);
          return match;
        });
        
        if (!taxInfo) {
          console.log('No tax data found for state:', stateName);
          return [100, 100, 400, 150];
        }
        
        // console.log('Found tax data for state:', stateName, taxInfo.total);
        return colorScale(taxInfo.total);
      },
      visible: layers.statePoints
    })] : []),
    // Counties layer
    new GeoJsonLayer({
      id: 'counties',
      data: (kingCountyVoting as any).features,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      lineWidthMinPixels: 1,
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
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-xl">Loading tax data...</div>
        </div>
      )}
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