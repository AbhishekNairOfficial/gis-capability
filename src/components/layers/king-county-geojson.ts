import { GeoJsonLayer } from "@deck.gl/layers";
import kingCountyVoting from '../../data/Voting_Districts_of_King_County___votdst_area.json';

const KingCountyGeoJson = ({ layers }: { layers: any }) => (
    new GeoJsonLayer({
    id: 'counties',
    data: kingCountyVoting as any,
    pickable: true,
    stroked: true,
    filled: true,
    extruded: false,
    lineWidthMinPixels: 1,
    getLineColor: [255, 255, 255],
    // getFillColor: [128, 0, 128, 100],
    getFillColor: (feature: any) => {
      const totalVoters = feature.properties.SUM_VOTERS;
      const minVoters = 100;
      const maxVoters = 8000;
      const normalized = Math.min(1, Math.max(0, (totalVoters - minVoters) / (maxVoters - minVoters)));
      return [128, 0, 128, normalized * 1000];
    },
    visible: layers.countyPoints
  })
);

export default KingCountyGeoJson;