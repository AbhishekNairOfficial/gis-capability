'use client';

import { useMap } from '@/lib/state/MapContext';
import { useState, useEffect } from 'react';

export default function ControlPanel() {
  const { state, dispatch } = useMap();
  const [zoom, setZoom] = useState(state.viewState.zoom);

  useEffect(() => {
    setZoom(state.viewState.zoom);
  }, [state.viewState.zoom]);

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    dispatch({
      type: 'SET_VIEW_STATE',
      payload: { ...state.viewState, zoom: newZoom }
    });
  };

  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Zoom Level: {zoom.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="20"
          step="0.1"
          value={zoom}
          onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Active Layers</h3>
        <div className="space-y-2">
          {Object.entries(state.layers).map(([layer, isVisible]) => (
            <label key={layer} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={() => dispatch({ type: 'TOGGLE_LAYER', payload: layer as keyof typeof state.layers })}
                className="rounded text-blue-600"
              />
              <span className="text-sm text-gray-700">{layer}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
} 