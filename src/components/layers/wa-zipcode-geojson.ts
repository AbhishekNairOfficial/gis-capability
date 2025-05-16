import { GeoJsonLayer } from "@deck.gl/layers";
import waZipcodeGeoJson from '../../data/wa_washington_zip_codes_geo.min.json';

const WashingtonZipcodeGeoJson = ({ layers, setZipCode, setCoordinates }: { layers: any, setZipCode: (zipCode: string) => void, setCoordinates: (coordinates: {x: number, y: number}) => void }) => (
    new GeoJsonLayer({
    id: 'zipcodes',
    data: (waZipcodeGeoJson as any).features,
    pickable: true,
    stroked: true,
    filled: true,
    extruded: false,
    lineWidthMinPixels: 1,
    getLineColor: [255, 255, 255],
    getFillColor: [239, 207, 189],
    highlightColor: [197, 100, 48, 255],
    autoHighlight: true,
    visible: layers.zipCodePoints,
    onHover: (info) => {
        setZipCode(info.object?.properties.ZCTA5CE10);
        setCoordinates({x: info.x, y: info.y});
      },
  })
);

export default WashingtonZipcodeGeoJson;