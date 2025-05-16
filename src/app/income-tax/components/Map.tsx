import { useState, useEffect, useRef } from "react";
import WashingtonZipcodeGeoJson from "@/components/layers/wa-zipcode-geojson";
import { MapViewState, useMap } from "@/lib/state/MapContext";
import DeckGL from "@deck.gl/react";
import MapGL from 'react-map-gl/mapbox';
import { Skeleton } from "@/components/ui/skeleton";
import {useMapStore} from "@/lib/zustand";
import useLayerVisibility from "@/lib/zustand/useLayerVisibility";
import useZipcodeStore from "@/lib/zustand/useZipcodeStore";
import HoverCard from "./hover-card";

const IncomeTaxMap = () => {

    // State variables and functions from Zustand
    const viewState = useMapStore((state: any) => state.viewState);
    const layers = useMapStore((state: any) => state.layers);
    const setViewState = useMapStore((state: any) => state.setViewState);

    const {x,y} = useZipcodeStore((state: any) => state.coordinates);
    const setCoordinates = useZipcodeStore((state: any) => state.setCoordinates);
    const setZipCode = useZipcodeStore((state: any) => state.setZipcode);
    const setIsLoading = useZipcodeStore((state: any) => state.setIsLoading);
    
    const [insights, setInsights] = useState<string>("");
    const abortControllerRef = useRef<AbortController | null>(null);

    useLayerVisibility();

    const deckLayers = [
      [WashingtonZipcodeGeoJson({setZipCode, setCoordinates, layers})]
    ];

    // const fetchInsights = async () => {
    //   // Cancel any existing request
    //   return;
    //   setIsLoading(true);
    //   if (abortControllerRef.current) {
    //     abortControllerRef.current.abort();
    //   }

    //   // Create new AbortController for this request
    //   abortControllerRef.current = new AbortController();

    //   const response = await fetch('/api/fetchZipCodeInsights', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ zipCode }),
    //     signal: abortControllerRef.current.signal
    //   });

    //   if (!response.ok) {
    //     const err = await response.json();
    //     throw new Error(err.error);
    //   }

    //   const data = await response?.json();
    //   setInsights(data.insights);
    //   setIsLoading(false);
    // };

    // useEffect(() => {
    //   if (zipCode) {
    //     const timeoutId = setTimeout(() => {
    //       fetchInsights();
    //     }, 500);

    //     return () => clearTimeout(timeoutId);
    //   }
    // }, [zipCode]);

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
        <HoverCard />
      </DeckGL>
    </div>
    )
}

export default IncomeTaxMap;