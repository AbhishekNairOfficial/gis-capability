import React from "react";
import useMapStore from ".";

const useLayerVisibility = () => {
    const zoom = useMapStore((state: any) => state.viewState.zoom);
    const layers = useMapStore((state: any) => state.layers);
    const setLayers = useMapStore((state: any) => state.setLayers);

    React.useEffect(() => {
        const newLayers = {
            ...layers,
            zipCodePoints: zoom >= 6,
        }
        setLayers(newLayers);
    }, [zoom]);
}
export default useLayerVisibility;