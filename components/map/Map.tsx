

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function LeafletMap() {
    return (
        <MapContainer
            center={[35.3607411, 138.727262]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: '100vh', width: '100%' }}
        >
        </MapContainer>
    );
}
