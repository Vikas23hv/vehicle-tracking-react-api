import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const MapComponent = ({ gpsData, stoppages }) => {
  const polylinePositions = gpsData.map(({ latitude, longitude }) => [latitude, longitude]);

  return (
    <MapContainer center={[12.9294916, 74.9173533]} zoom={13} style={{ height: '600px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={polylinePositions} color="blue" />
      {stoppages.map((stoppage, index) => (
        <Marker
          key={index}
          position={[stoppage.latitude, stoppage.longitude]}
          icon={L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          })}
        >
          <Popup>
            <div>
              <p>Reach Time: {stoppage.reachTime}</p>
              <p>End Time: {stoppage.endTime}</p>
              <p>Duration: {stoppage.duration} minutes</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
