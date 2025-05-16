import { create } from 'zustand';
import { MapViewState } from '../state/MapContext';

const useMapStore = create((set) => ({
    viewState: {
        longitude: -122.16753150210259,
        latitude: 47.57663821379344,
        zoom: 3,
        pitch: 0,
        bearing: 0,
    },
    layers:{
        zipCodePoints: false,
    },
    setViewState: (viewState: MapViewState) => set({ viewState }),
    toggleLayer: (layer: string) => set((state: any) => ({ layers: { ...state.layers, [layer]: !state.layers[layer] } })),
    setLayers: (layers: any) => set({ layers }),
}))

export default useMapStore;