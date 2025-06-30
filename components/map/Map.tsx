import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';

const GoogleMap = () => {
    const googleMapsUrl = `https://mt1.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}&token=96706`;
    return (
        <MapContainer className="z-1" center={[34.0522, -118.2437]} zoom={10} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                url={googleMapsUrl}
                attribution='&copy; Google Maps'
            />
        </MapContainer>
    );
};

export default GoogleMap;