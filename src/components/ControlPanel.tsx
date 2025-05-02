'use client';

import { useMap } from '@/lib/state/MapContext';
import { useState, useEffect } from 'react';

const ZOOM_LEVELS = {
  STATE_LEVEL: 6,
  COUNTY_LEVEL: 8,
  DETAILED_LEVEL: 10,
};

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

  const getLayerOpacity = (layer: string) => {
    switch (layer) {
      case 'statePoints':
        return zoom >= 3 && zoom <= 7 ? 1 : 0.3;
      case 'countyPoints':
        return zoom >= 6 && zoom <= 9 ? 1 : 0.3;
      case 'detailedPoints':
        return zoom >= 8 ? 1 : 0.3;
      default:
        return 0.3;
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 min-w-[280px]">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-600">
            Zoom Level
          </label>
          <span className="text-sm font-semibold text-gray-800 bg-gray-50 px-2 py-1 rounded">
            {zoom.toFixed(2)}x
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="20"
          step="0.1"
          value={zoom}
          onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          style={{
            background: 'linear-gradient(to right, #2563eb 0%, #2563eb ' + (zoom / 20 * 100) + '%, #e5e7eb ' + (zoom / 20 * 100) + '%, #e5e7eb 100%)'
          }}
        />
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-3">Active Layers</h3>
        <div className="space-y-2.5">
          {Object.entries(state.layers).map(([layer, isVisible]) => (
            <div 
              key={layer} 
              className="flex items-center justify-between p-2.5 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: getLayerOpacity(layer) === 1 ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                border: getLayerOpacity(layer) === 1 ? '1px solid rgba(37, 99, 235, 0.1)' : '1px solid transparent'
              }}
            >
              <div className="flex items-center space-x-3">
                <span 
                  className="text-sm transition-colors duration-200"
                  style={{
                    color: getLayerOpacity(layer) === 1 ? '#1e40af' : '#64748b',
                    fontWeight: getLayerOpacity(layer) === 1 ? '500' : '400'
                  }}
                >
                  {layer.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: getLayerOpacity(layer) === 1 ? '#2563eb' : '#e5e7eb',
                    transform: getLayerOpacity(layer) === 1 ? 'scale(1.2)' : 'scale(1)'
                  }}
                />
                <span className="text-xs text-gray-400">
                  {layer === 'statePoints' ? '3-7x' : layer === 'countyPoints' ? '6-9x' : '8x+'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 