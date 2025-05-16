import { useState, useEffect, useRef } from "react";
import WashingtonZipcodeGeoJson from "@/components/layers/wa-zipcode-geojson";
import { MapViewState, useMap } from "@/lib/state/MapContext";
import DeckGL from "@deck.gl/react";
import MapGL from 'react-map-gl/mapbox';

const IncomTaxMap = () => {
    const { state, dispatch } = useMap();

    const [zipCode, setZipCode] = useState<string>("");
    const abortControllerRef = useRef<AbortController | null>(null);

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
      [WashingtonZipcodeGeoJson({layers: {countyPoints: true}, setZipCode})]
    ];

    const fetchInsights = async () => {
      // Cancel any existing request
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
      console.log(data, zipCode);
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
    )
}

export default IncomTaxMap;