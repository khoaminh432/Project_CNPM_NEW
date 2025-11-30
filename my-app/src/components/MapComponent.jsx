import React, { use, useEffect, useRef, useState } from 'react';
import { InteractiveMap,} from '@goongmaps/goong-map-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import PointLocation from './MapHandle/PointLocation';
import {createRoute, getDirection} from "./../api/GoongDirection";
import DrawRoute from './MapHandle/DrawRoute';
const symbolLocation = <i className="fa-solid fa-location-dot"></i>;
const styleLocation = {
  temp:{color:'black', style:"📍"},
  pointtraim:{color:"red",style:symbolLocation},
  pointcurrent:{color:"blue",style:symbolLocation},
  pointstart:{color:"green",style:symbolLocation},
  pointend:{color:"black",style:symbolLocation},
}
const GOONG_MAPTILES_KEY = process.env.REACT_APP_GOONG_API_MAPTILE_KEY;
function CreatePoint(locationnew,styleView={ colorLocation: 'red', fontSize: "1.5em" }){

  return (
  <PointLocation 
    location={locationnew}
    styleView={styleView}
  />)
}
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
/*
[
    { name: "Van Hanh Mall", lat: 10.7704868, lng: 106.6704975 },
    { name: "Đại Học Sài Gòn csc", lat: 10.75997732, lng: 106.6821643 },
    { name: "Trường tiểu học Hùng Vương", lat: 10.7536827, lng: 106.6526513 },
    { name: "Trường thpt Thăng Long", lat: 10.7511922, lng: 106.6609409 }
  ]
*/ 
const MapComponent = ({positionCurrent={
    start: null,
    end: null
  },stops=[]}) => {
  const [locations,setLocation] = useState([
    {
    start: null,
    end: null
  }
  ]);
  // Cập nhật locations khi stops thay đổi
  useEffect(() => {
  const stopLocations = stops.map((stop) => ({
    ...stop,           // copy toàn bộ thuộc tính Stop
    latitude: stop.latitude,
    longitude: stop.longitude
  }));

  setLocation(prev => [
    prev[0],           // giữ lại element đầu: {start:null, end:null}
    ...stopLocations   // thêm toàn bộ stop vào
  ]);
  
}, [stops]);
  
  const [routesfull,setRoutesFull] = useState(null)
  const [viewport, setViewport] = useState({
    latitude: 10.7500452,
    longitude: 106.6622499,
    zoom: 15,
    width: '100%',
    height: '100%',
    bearing: 0,
    pitch: 0,
    transitionDuration: 1000
  });
  const [chooseMapLocation,setChooseMapLocation] = useState(null)
  
  
  useEffect(()=>{
    
    if(positionCurrent.start)
      setCenter(positionCurrent.start)
    if(positionCurrent.end)
      setCenter(positionCurrent.end)
  },[positionCurrent.start,positionCurrent.end])
  // Cập nhật center khi locations thay đổi
  useEffect(()=>{
    if(locations.length>1){
      setCenter(locations.at(-1))
    }},[locations.at(-1)])
  const handleMapChoose = (event) => {
    let lngLat = event.lngLat;
    const [lng, lat] = lngLat;
    setChooseMapLocation({ lat:lat, lng: lng });
  };
  function handleAddlocation(location){
    setLocation(loc=>[...loc,location])
  }
  function handleRemoveLocation(index){
    setLocation(locations.filter((__,i)=>i!==index))
  }
  // selectedPoint dùng cho popup; userLocation để vẽ marker vị trí hiện tại
  const [selectedPoint, setSelectedPoint] = React.useState(null);
  const [userLocation, setUserLocation] = React.useState(null);

  const zoomIn = () => {
    setViewport(prev => ({ ...prev, zoom: Math.min((prev.zoom || 0) + 1, 22) }));
  };

  const zoomOut = () => {
    setViewport(prev => ({ ...prev, zoom: Math.max((prev.zoom || 0) - 1, 0) }));
  };
  function setCenter(location){
    setViewport(prev=>({...prev,latitude:location.lat||location.latitude,longitude:location.lng||location.longitude,zoom: Math.max(prev.zoom || 0, 17)}))
  }
  const locateMe = () => {

    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ Geolocation.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = { lat:latitude, lng:longitude };
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
  const handleViewportChange = React.useCallback((vp) => {
  setViewport(prev => ({ ...prev, ...vp }));
}, []);
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
        onClick={handleMapChoose}
      >
      
        {/* Marker mặc định: truyền fontSize tính theo zoom */}
        {locations.filter((_,index)=>index!==0).map((loc, index) => (
          
          <>
          <PointLocation
            key={index}
            location={loc}
            styleView={{ colorLocation: 'yellow', fontSize: currentFont }} 
            styleLocation={styleLocation.pointtraim}
          />
          
          </>

        ))}
        {<DrawRoute origin={locations[1]} destination={locations.at(2)} styleDrawView={{}} />}
        {<DrawRoute origin={locations[3]} destination={locations.at(4)} styleDrawView={{}} />}

        
        
        
        {/* Marker cho vị trí hiện tại (được tạo khi userLocation != null) */}
        {
          <>
          {positionCurrent.start && (
            <PointLocation
              location={{ ...positionCurrent.start, name: 'Điểm bắt đầu' }}
              styleView={{ colorLocation: 'green', fontSize: currentFont }}  
              styleLocation={styleLocation.pointstart}
            />
          )}
          {positionCurrent.end && (
            <PointLocation
              location={{ ...positionCurrent.end, name: 'Điểm kết thúc' }}
              styleView={{ colorLocation: 'black', fontSize: currentFont }}  
              styleLocation={styleLocation.pointend}
            />
          )}
          </>
        }
        {userLocation && (
          
           <>
            <PointLocation
            location={{ ...userLocation, name: 'Vị trí của bạn' }}
            styleView={{ colorLocation: 'blue', fontSize: currentFont }}  
            styleLocation={styleLocation.pointcurrent}
          />
           </>
        )  
        }
        {chooseMapLocation && (
          <PointLocation
            location={{...chooseMapLocation, name: 'Vị trí đã chọn'}}
            styleView={{ colorLocation: 'green', fontSize: currentFont }} 
            styleLocation={styleLocation.temp} 
          />
        )}
        {/* Popup khi click marker */}
      </InteractiveMap>
    </div>
  );
};

export default MapComponent;