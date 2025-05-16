import { GeoJsonLayer } from "@deck.gl/layers";
import waZipcodeGeoJson from '../../data/wa_washington_zip_codes_geo.min.json';

const WashingtonZipcodeGeoJson = ({ layers, setZipCode, setHoverInfo }: { layers: any, setZipCode: (zipCode: string) => void, setHoverInfo: (hoverInfo: any) => void }) => (
    new GeoJsonLayer({
    id: 'zipcodes',
    data: (waZipcodeGeoJson as any).features,
    pickable: true,
    stroked: true,
    filled: true,
    extruded: false,
    lineWidthMinPixels: 1,
    getLineColor: [255, 255, 255],
    getFillColor: [173, 216, 230, 200],
    highlightColor: [0, 0, 139, 200],
    autoHighlight: true,
    visible: layers.countyPoints,
    onHover: (info) => {
        setZipCode(info.object?.properties.ZCTA5CE10);
        setHoverInfo(info);
      },
  })
);

export default WashingtonZipcodeGeoJson;