import WashingtonZipcodeGeoJson from "@/components/layers/wa-zipcode-geojson";
import { MapViewState } from "@/lib/state/MapContext";
import DeckGL from "@deck.gl/react";
import MapGL from 'react-map-gl/mapbox';
import { useMapStore } from "@/lib/zustand";
import useLayerVisibility from "@/lib/zustand/useLayerVisibility";
import HoverCard from "./hover-card";
import ZipcodeDrawer from "./ZipcodeDrawer";

const IncomeTaxMap = () => {

  // State variables and functions from Zustand
  const viewState = useMapStore((state: any) => state.viewState);
  const setViewState = useMapStore((state: any) => state.setViewState);

  // Layer visibility hook
  useLayerVisibility();

  const deckLayers = [
    [WashingtonZipcodeGeoJson()]
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
        <ZipcodeDrawer />
      </DeckGL>
    </div>
  )
}

export default IncomeTaxMap;