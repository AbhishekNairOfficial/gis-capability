import { HexagonLayer } from "@deck.gl/aggregation-layers";
import kingCountyVoting from '../../data/Voting_Districts_of_King_County___votdst_area.json';
import * as turf from '@turf/turf';

const KingCountyHex = ({ layers, setHoverInfo }: { layers: any, setHoverInfo: any }) => {
    return new HexagonLayer({
        id: 'hexagons',
        data: (kingCountyVoting as any).features,
        pickable: true,
        extruded: true,
        radius: 1000, // base radius
        getHexagonRadius: (objects: any[]) => {
          const totalVoters = objects.reduce((sum, obj) => sum + obj.properties.SUM_VOTERS, 0);
          console.log('Total voters in hexagon:', totalVoters);
          // Scale between 10 and 100 based on voters, assuming range of 100-5000 voters
          const minVoters = 100;
          const maxVoters = 8000;
          const normalized = Math.min(1, Math.max(0, (totalVoters - minVoters) / (maxVoters - minVoters)));
          return 10 + normalized * 990;
        },
        elevationScale: 0,
        getPosition: (d: any) => {
          const centroid = turf.centroid(d);
          return centroid.geometry.coordinates as [number, number, number];
        },
        getElevationValue: (objects: any[]) => {
          return objects.reduce((sum, obj) => sum + obj.properties.SUM_VOTERS, 0);
        },
        getColorValue: (objects: any[]) => {
          return objects.reduce((sum, obj) => sum + obj.properties.SUM_VOTERS, 0);
        },
        colorRange: [
          [255, 255, 178, 128],
          [254, 217, 118, 128],
          [254, 178, 76, 128],
          [253, 141, 60, 128],
          [240, 59, 32, 128],
          [189, 0, 38, 128]
        ],
        lowerPercentile: 0,
        upperPercentile: 100,
        material: {
          ambient: 0.4,
          diffuse: 0.6,
          shininess: 32,
          specularColor: [51, 51, 51]
        },
        visible: layers.detailedPoints,
        // Add hover handling
        onHover: (info) => {
          setHoverInfo(info.object ? {
            x: info.x,
            y: info.y,
            object: info.object
          } : null);
          return true;
        },
        // Add black border
        stroked: true,
        lineWidthMinPixels: 2,
        getLineColor: [0, 0, 0, 255],
        // Highlight on hover
        autoHighlight: true,
        highlightColor: [255, 255, 255, 200]
      })
}

export default KingCountyHex;