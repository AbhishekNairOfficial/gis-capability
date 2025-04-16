import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

export interface LayerState {
  statePoints: boolean;
  countyPoints: boolean;
  detailedPoints: boolean;
}

interface MapState {
  viewState: MapViewState;
  layers: LayerState;
}

type MapAction =
  | { type: 'SET_VIEW_STATE'; payload: Partial<MapViewState> }
  | { type: 'TOGGLE_LAYER'; payload: keyof LayerState };

const initialState: MapState = {
  viewState: {
    longitude: -122.16753150210259,
    latitude: 47.57663821379344,
    zoom: 3,
    pitch: 0,
    bearing: 0,
  },
  layers: {
    statePoints: true,
    countyPoints: false,
    detailedPoints: false,
  },
};

const MapContext = createContext<{
  state: MapState;
  dispatch: React.Dispatch<MapAction>;
} | null>(null);

function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case 'SET_VIEW_STATE':
      return {
        ...state,
        viewState: { ...state.viewState, ...action.payload },
      };
    case 'TOGGLE_LAYER':
      return {
        ...state,
        layers: {
          ...state.layers,
          [action.payload]: !state.layers[action.payload],
        },
      };
    default:
      return state;
  }
}

export function MapProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  return (
    <MapContext.Provider value={{ state, dispatch }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
} 