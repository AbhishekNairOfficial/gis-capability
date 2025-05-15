import { GeoJsonLayer } from "@deck.gl/layers";
import statesGeoJson from '../../data/us-states-geojson.json';

interface TaxData {
    state_name: string;
    total: number;
  }

const UsStates = ({ taxData, colorScale, layers }: { taxData: TaxData[], colorScale: (value: number) => [number, number, number, number], layers: any }) => (
    new GeoJsonLayer({
        id: 'states',
        data: statesGeoJson as any,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: false,
        lineWidthMinPixels: 1,
        getLineColor: [255, 255, 255],
        getFillColor: (feature: any) => {
          const stateName = feature.properties.NAME;
          
          const taxInfo = taxData.find(item => {
            const match = item.state_name.toLowerCase() === stateName.toLowerCase();
            return match;
          });
          
          if (!taxInfo) {
            console.log('No tax data found for state:', stateName);
            return [100, 100, 400, 150];
          }
          
          return colorScale(taxInfo.total);
        },
        visible: layers.statePoints
      })
)

export default UsStates;