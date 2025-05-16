import { useState, useEffect, useRef } from "react";
import WashingtonZipcodeGeoJson from "@/components/layers/wa-zipcode-geojson";
import { MapViewState, useMap } from "@/lib/state/MapContext";
import DeckGL from "@deck.gl/react";
import MapGL from 'react-map-gl/mapbox';
import { Skeleton } from "@/components/ui/skeleton";
import useMapStore from "@/lib/zustand";
import useLayerVisibility from "@/lib/zustand/useLayerVisibility";

const IncomeTaxMap = () => {
    const viewState = useMapStore((state: any) => state.viewState);
    const layers = useMapStore((state: any) => state.layers);
    const setViewState = useMapStore((state: any) => state.setViewState);
    const [{x,y}, setHoverInfo] = useState({x: 0, y: 0});

    const [zipCode, setZipCode] = useState<string>("");
    const [insights, setInsights] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    useLayerVisibility();

    const deckLayers = [
      [WashingtonZipcodeGeoJson({setZipCode, setHoverInfo, layers})]
    ];

    const fetchInsights = async () => {
      // Cancel any existing request
      return;
      setIsLoading(true);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/fetchZipCodeInsights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ zipCode }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error);
      }

      const data = await response?.json();
      setInsights(data.insights);
      setIsLoading(false);
    };

    useEffect(() => {
      if (zipCode) {
        const timeoutId = setTimeout(() => {
          fetchInsights();
        }, 500);

        return () => clearTimeout(timeoutId);
      }
    }, [zipCode]);

    return (
        <div className="relative w-full h-screen">
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState as MapViewState)}
        controller={true}
        layers={deckLayers}
      >
        <MapGL
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        />
        {!!insights && (
          <div
          style={{
            left: `${x}px`,
            top: `${y}px`,
          }}
          className="absolute -translate-x-1/2 -translate-y-full -mt-2 bg-white/98 p-3 pl-6 rounded-lg shadow-lg pointer-events-none z-[1000] border border-black/10 backdrop-blur-sm min-w-[140px] text-left flex flex-col gap-1"
        >
          <div className="absolute left-2 top-3 bottom-3 w-0.5 bg-blue-600 rounded-sm" />
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">
            {zipCode}
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-3 w-[300px]" />
              <Skeleton className="h-3 w-[300px]" />
              <Skeleton className="h-3 w-[250px]" />
            </div>
          ) : insights && (
            <div className="text-xs text-slate-500">
              {insights}
            </div>
          )}
        </div>
        )}
      </DeckGL>
    </div>
    )
}

export default IncomeTaxMap;