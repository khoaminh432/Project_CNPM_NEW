// MapComponent.jsx
import React from 'react';
import { InteractiveMap,} from '@goongmaps/goong-map-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import PointLocation from './MapHandle/PointLocation';
const GOONG_MAPTILES_KEY = process.env.REACT_APP_GOONG_API_MAPTILE_KEY;

const styleZoomInOut = {
  color: "black",
  fontSize: "1.4em", width: 44, height: 36,
  borderRadius: 4, border: 'none', background: '#fff',
  boxShadow: '0 1px 4px rgba(0,0,0,.2)', cursor: 'pointer',
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
};
const styleLocate = {
  ...styleZoomInOut,
  width: 44,
  height: 36,
  fontSize: '1.1em'
};

const MapComponent = () => {
  const locations = [
    { name: "Van Hanh Mall", lat: 10.7704868, lng: 106.6704975 },
    { name: "Đại Học Sài Gòn csc", lat: 10.75997732, lng: 106.6821643 },
    { name: "Trường tiểu học Hùng Vương", lat: 10.7536827, lng: 106.6526513 },
    { name: "Trường thpt Thăng Long", lat: 10.7511922, lng: 106.6609409 }
  ];

  const [viewport, setViewport] = React.useState({
    latitude: 10.7500452,
    longitude: 106.6622499,
    zoom: 15,
    width: '100%',
    height: '100%',
    bearing: 0,
    pitch: 0,
    transitionDuration: 1000
  });

  // selectedPoint dùng cho popup; userLocation để vẽ marker vị trí hiện tại
  const [selectedPoint, setSelectedPoint] = React.useState(null);
  const [userLocation, setUserLocation] = React.useState(null);

  const zoomIn = () => {
    setViewport(prev => ({ ...prev, zoom: Math.min((prev.zoom || 0) + 1, 22) }));
  };

  const zoomOut = () => {
    setViewport(prev => ({ ...prev, zoom: Math.max((prev.zoom || 0) - 1, 0) }));
  };

  const locateMe = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ Geolocation.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = { latitude, longitude };
        setUserLocation(loc);
        setSelectedPoint({ ...loc, name: 'Vị trí của bạn' });
        setViewport(prev => ({
          ...prev,
          latitude,
          longitude,
          zoom: Math.max(prev.zoom || 0, 15)
        }));
      },
      (err) => {
        console.error('Geolocation error', err);
        alert('Không thể lấy vị trí: ' + (err.message || err.code));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // map zoom -> font-size mapping
  const calcFontSize = (zoom) => {
    const z = (typeof zoom === 'number') ? zoom : 15;
    // base px at zoom 15, scale exponentially so changes feel natural
    const basePx = 14;
    const scale = Math.pow(1.18, (z - 15)); // tweak 1.18 to adjust sensitivity
    const sizePx = Math.round(basePx * scale);
    return `${Math.max(8, sizePx)}px`;
  };

  // ensure onViewportChange merges properties (so width/height remain)
  const handleViewportChange = (vp) => {
    setViewport(prev => ({ ...prev, ...vp }));
  };

  const currentFont = "1.5em";

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Zoom + Locate controls */}
      <div style={{
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}>
        <button aria-label="Locate me" onClick={locateMe} style={styleLocate}><i className="fa-solid fa-location-dot"></i> </button>
        <button aria-label="Zoom in" onClick={zoomIn} style={styleZoomInOut}>+</button>
        <button aria-label="Zoom out" onClick={zoomOut} style={styleZoomInOut}>−</button>
      </div>

      <InteractiveMap
        {...viewport}
        goongApiAccessToken={GOONG_MAPTILES_KEY}
        onViewportChange={handleViewportChange}
        height="100%"
        width="100%"
      >
        {/* Marker mặc định: truyền fontSize tính theo zoom */}
        {locations.map((loc, index) => (
          <PointLocation
            key={index}
            location={{ latitude: loc.lat, longitude: loc.lng, name: loc.name }}
            styleView={{ colorLocation: 'red', fontSize: currentFont }}
             
          />
        ))}

        {/* Marker cho vị trí hiện tại (được tạo khi userLocation != null) */}
        {userLocation && (
          <PointLocation
            location={{ ...userLocation, name: 'Vị trí của bạn' }}
            styleView={{ colorLocation: 'blue', fontSize: currentFont }}
            
          />
        )}

        {/* Popup khi click marker */}
        
      </InteractiveMap>
    </div>
  );
};

export default MapComponent;