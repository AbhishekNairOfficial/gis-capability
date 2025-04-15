import * as turf from '@turf/turf';
import { Feature, Polygon, Point } from 'geojson';

// Washington State boundary
export const usStates: Feature<Polygon>[] = [
  {
    type: 'Feature',
    properties: { name: 'Washington' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-124.7, 48.4],
        [-124.7, 45.5],
        [-116.9, 45.5],
        [-116.9, 48.4],
        [-124.7, 48.4]
      ]]
    }
  }
];

// King County boundary (simplified)
export const kingCounty: Feature<Polygon> = {
  type: 'Feature',
  properties: { name: 'King County' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [-122.5, 47.8],
      [-122.5, 47.2],
      [-121.8, 47.2],
      [-121.8, 47.8],
      [-122.5, 47.8]
    ]]
  }
};

// Seattle city boundary (simplified)
export const seattle: Feature<Polygon> = {
  type: 'Feature',
  properties: { name: 'Seattle' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [-122.4, 47.7],
      [-122.4, 47.5],
      [-122.2, 47.5],
      [-122.2, 47.7],
      [-122.4, 47.7]
    ]]
  }
};

// State capitals (points)
export const stateCapitals: Feature<Point>[] = [
  {
    type: 'Feature',
    properties: { name: 'Olympia' },
    geometry: {
      type: 'Point',
      coordinates: [-122.9, 47.0]
    }
  }
]; 