import { Feature, Polygon, Point, MultiPoint } from 'geojson';

// Washington State boundary from GeoJSON
export const fetchUSA = async (): Promise<Feature<Polygon>> => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/glynnbird/countriesgeojson/master/united%20states%20of%20america.geojson');
    if (!response.ok) {
      throw new Error('Failed to fetch Washington state boundary data');
    }
    const data = await response.json();
    return data as Feature<Polygon>;
  } catch (error) {
    console.error('Error fetching Washington state boundary:', error);
    throw error;
  }
};

// King County boundary (simplified)
export const kingCounty: Feature<Polygon> = {
  type: 'Feature',
  properties: { name: 'King County' },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-122.4, 47.7],
        [-122.4, 47.5],
        [-122.2, 47.5],
        [-122.2, 47.7],
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

// Olympia (Washington state capital)
export const olympia: Feature<MultiPoint> = {
  type: 'Feature',
  properties: { name: 'Olympia' },
  geometry: {
    type: 'MultiPoint',
    coordinates: [
    [-86.279118, 32.361538], // Montgomery
    [-134.41974, 58.301935], // Juneau
    [-112.073844, 33.448457], // Phoenix
    [-92.331122, 34.736009], // Little Rock
    [-121.468926, 38.555605], // Sacramento
    [-104.984167, 39.7391667], // Denver
    [-72.677, 41.767], // Hartford
    [-75.526755, 39.161921], // Dover
    [-84.27277, 30.4518], // Tallahassee
    [-83.6487, 32.648], // Atlanta
    [-157.826182, 21.30895], // Honolulu
    [-116.237651, 43.613739], // Boise
    [-89.650373, 39.78325], // Springfield
    [-86.147685, 39.790942], // Indianapolis
    [-93.620866, 41.590939], // Des Moines
    [-95.69, 39.055823], // Topeka
    [-84.86311, 38.197274], // Frankfort
    [-91.140229, 30.45809], // Baton Rouge
    [-69.765261, 44.323535], // Augusta
    [-76.501157, 38.972945], // Annapolis
    [-71.0275, 42.2352], // Boston
    [-84.5467, 42.7335], // Lansing
    [-93.094, 44.95], // St. Paul
    [-90.207, 32.32], // Jackson
    [-92.189283, 38.572954], // Jefferson City
    [-112.027031, 46.595805], // Helena
    [-96.675345, 40.809868], // Lincoln
    [-119.753877, 39.160949], // Carson City
    [-71.549127, 43.220093], // Concord
    [-74.756138, 40.221741], // Trenton
    [-105.964575, 35.667231], // Santa Fe
    [-78.6389, 42.6525], // Albany
    [-78.638, 35.771], // Raleigh
    [-100.779004, 48.813343], // Bismarck
    [-82.996216, 39.961176], // Columbus
    [-97.508265, 35.46756], // Oklahoma City
    [-123.029159, 44.931109], // Salem
    [-76.875613, 40.273191], // Harrisburg
    [-71.422132, 41.82355], // Providence
    [-81.035, 34.000], // Columbia
    [-100.34972, 44.367966], // Pierre
    [-86.784, 36.165], // Nashville
    [-97.75, 30.266667], // Austin
    [-111.892622, 40.7547], // Salt Lake City
    [-72.57194, 44.26639], // Montpelier
    [-77.46, 37.54], // Richmond
    [-122.893077, 47.042418], // Olympia
    [-81.633294, 38.349497], // Charleston
    [-89.384444, 43.074722], // Madison
    [-104.802042, 41.145548], // Cheyenne
    ]
  }
}; 