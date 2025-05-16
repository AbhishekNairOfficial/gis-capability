'use client';

import { MapProvider } from "@/lib/state/MapContext";
import IncomTaxMap from "./components/Map";


const IncomeTaxPage = () => {
    return (
        <MapProvider>
            <IncomTaxMap />
        </MapProvider>
    )
}

export default IncomeTaxPage;