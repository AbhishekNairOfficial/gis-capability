'use client';

import { MapProvider } from '@/lib/state/MapContext';
import Map from '@/components/Map';
import ControlPanel from '@/components/ControlPanel';

export default function Home() {
  return (
    <MapProvider>
      <main className="relative w-full h-screen">
        <Map />
        <ControlPanel />
      </main>
    </MapProvider>
  );
} 