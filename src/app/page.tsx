'use client';

import { useState } from 'react';
import Map from '@/components/Map';
import ControlPanel from '@/components/ControlPanel';

export default function Home() {
  const [viewState, setViewState] = useState({
    longitude: -122.16753150210259,
    latitude: 47.57663821379344,
    zoom: 13,
    pitch: 0,
    bearing: 0
  });

  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    scatterplot: true,
    path: true,
    states: true,
    counties: true,
    cities: true,
    capitals: true
  });

  const handleLayerToggle = (layerId: string) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  const handleZoomChange = (zoom: number) => {
    setViewState(prev => ({
      ...prev,
      zoom
    }));
  };

  return (
    <main className="relative w-full h-screen">
      <Map 
        viewState={viewState}
        onViewStateChange={setViewState}
        activeLayers={activeLayers}
      />
      <ControlPanel
        onLayerToggle={handleLayerToggle}
        onZoomChange={handleZoomChange}
        activeLayers={activeLayers}
      />
    </main>
  );
} 