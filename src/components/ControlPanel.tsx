'use client';

import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ControlPanelProps {
  onLayerToggle: (layerId: string) => void;
  onZoomChange: (zoom: number) => void;
  activeLayers: Record<string, boolean>;
}

export default function ControlPanel({ onLayerToggle, onZoomChange, activeLayers }: ControlPanelProps) {
  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
      <div className="space-y-4">
        <div>
          <Label>Zoom Level</Label>
          <Slider
            defaultValue={[13]}
            min={1}
            max={20}
            step={0.1}
            onValueChange={(value) => onZoomChange(value[0])}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="scatterplot"
              checked={activeLayers.scatterplot}
              onCheckedChange={() => onLayerToggle('scatterplot')}
            />
            <Label htmlFor="scatterplot">Points</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="path"
              checked={activeLayers.path}
              onCheckedChange={() => onLayerToggle('path')}
            />
            <Label htmlFor="path">Path</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="states"
              checked={activeLayers.countries}
              onCheckedChange={() => onLayerToggle('countries')}
            />
            <Label htmlFor="states">USA</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="states"
              checked={activeLayers.states}
              onCheckedChange={() => onLayerToggle('states')}
            />
            <Label htmlFor="states">US States</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="counties"
              checked={activeLayers.counties}
              onCheckedChange={() => onLayerToggle('counties')}
            />
            <Label htmlFor="counties">US Counties</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="cities"
              checked={activeLayers.cities}
              onCheckedChange={() => onLayerToggle('cities')}
            />
            <Label htmlFor="cities">US Cities</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="capitals"
              checked={activeLayers.capitals}
              onCheckedChange={() => onLayerToggle('capitals')}
            />
            <Label htmlFor="capitals">State Capitals</Label>
          </div>
        </div>
      </div>
    </div>
  );
} 