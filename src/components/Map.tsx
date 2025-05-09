'use client';

import { useMap } from '@/lib/state/MapContext';
import { useLayerVisibility } from '@/lib/hooks/useLayerVisibility';
import { MapViewState } from '@/lib/state/MapContext';
import { DeckGL } from '@deck.gl/react';
import MapGL from 'react-map-gl/mapbox';
import { GeoJsonLayer } from '@deck.gl/layers';
import { HexagonLayer } from '@deck.gl/aggregation-layers';
import * as turf from '@turf/turf';
import 'mapbox-gl/dist/mapbox-gl.css';
import { fetchTaxData } from '@/app/actions/taxData';
import { useEffect, useState } from 'react';
import statesGeoJson from '../data/us-states-geojson.json';
import kingCountyVoting from '../data/Voting_Districts_of_King_County___votdst_area.json';
import Loading from '@/app/loading';
import HoverCard from './hover-card';

interface TaxData {
  state_name: string;
  total: number;
}

interface MapProps {
  // No props needed as we're using context
}

interface VotingFeature {
  type: string;
  properties: {
    SUM_VOTERS: number;
    [key: string]: any;
  };
  geometry: any;
}

interface VotingGeoJSON {
  type: string;
  features: VotingFeature[];
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

// Radius scale function
function createRadiusScale(min: number, max: number) {
  return (value: number): number => {
    // Use power scale for better contrast
    const power = 0.5; // Square root scale
    const normalized = Math.pow((value - min) / (max - min), power);
    
    // Scale radius between 1 and 49 pixels
    return 1 + normalized * 49;
  };
}

export default function MapComponent({}: MapProps) {
  const { state, dispatch } = useMap();
  const layers = useLayerVisibility();
  const [taxData, setTaxData] = useState<TaxData[]>([]);
  const [colorScale, setColorScale] = useState<((value: number) => [number, number, number, number]) | null>(null);
  const [radiusScale, setRadiusScale] = useState<((value: number) => number) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    async function loadData() {
      try {
        // Load tax data
        const data = await fetchTaxData();
        setTaxData(data);
        
        // Calculate min and max values for the color scale
        const totals = data.map(item => item.total);
        const min = Math.min(...totals);
        const max = Math.max(...totals);
        
        // Create color scale function
        setColorScale(() => createColorScale(min, max));

        // Calculate radius scale for voting data
        const votingData = kingCountyVoting as VotingGeoJSON;
        if (votingData?.features) {
          const voters = votingData.features.map(feature => feature.properties.SUM_VOTERS);
          const minVoters = Math.min(...voters);
          const maxVoters = Math.max(...voters);
          setRadiusScale(() => createRadiusScale(minVoters, maxVoters));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
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
        
        const taxInfo = taxData.find(item => {
          const match = item.state_name.toLowerCase() === stateName.toLowerCase();
          return match;
        });
        
        if (!taxInfo) {
          console.log('No tax data found for state:', stateName);
          return [100, 100, 400, 150];
        }
        
        return colorScale(taxInfo.total);
      },
      visible: layers.statePoints
    })] : []),
    // Counties layer
    new GeoJsonLayer({
      id: 'counties',
      data: kingCountyVoting as any,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      lineWidthMinPixels: 1,
      getLineColor: [255, 255, 255],
      getFillColor: [128, 0, 128, 100],
      visible: layers.countyPoints
    }),
    // Hexagon layer for voting data
    ...(radiusScale ? [new HexagonLayer({
      id: 'hexagons',
      data: (kingCountyVoting as any).features,
      pickable: true,
      extruded: true,
      radius: 1000, // base radius
      getHexagonRadius: (objects: any[]) => {
        const totalVoters = objects.reduce((sum, obj) => sum + obj.properties.SUM_VOTERS, 0);
        console.log('Total voters in hexagon:', totalVoters);
        // Scale between 10 and 100 based on voters, assuming range of 100-5000 voters
        const minVoters = 100;
        const maxVoters = 8000;
        const normalized = Math.min(1, Math.max(0, (totalVoters - minVoters) / (maxVoters - minVoters)));
        return 10 + normalized * 990;
      },
      elevationScale: 0,
      getPosition: (d: any) => {
        const centroid = turf.centroid(d);
        return centroid.geometry.coordinates as [number, number, number];
      },
      getElevationValue: (objects: any[]) => {
        return objects.reduce((sum, obj) => sum + obj.properties.SUM_VOTERS, 0);
      },
      getColorValue: (objects: any[]) => {
        return objects.reduce((sum, obj) => sum + obj.properties.SUM_VOTERS, 0);
      },
      colorRange: [
        [255, 255, 178, 128],
        [254, 217, 118, 128],
        [254, 178, 76, 128],
        [253, 141, 60, 128],
        [240, 59, 32, 128],
        [189, 0, 38, 128]
      ],
      lowerPercentile: 0,
      upperPercentile: 100,
      material: {
        ambient: 0.4,
        diffuse: 0.6,
        shininess: 32,
        specularColor: [51, 51, 51]
      },
      visible: layers.detailedPoints,
      // Add hover handling
      onHover: (info) => {
        setHoverInfo(info.object ? {
          x: info.x,
          y: info.y,
          object: info.object
        } : null);
        return true;
      },
      // Add black border
      stroked: true,
      lineWidthMinPixels: 2,
      getLineColor: [0, 0, 0, 255],
      // Highlight on hover
      autoHighlight: true,
      highlightColor: [255, 255, 255, 200]
    })] : [])
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
      <HoverCard hoverInfo={hoverInfo} displayValue={displayValue} />
    </div>
  );
} 