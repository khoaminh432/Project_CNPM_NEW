import { Marker,Popup } from "@goongmaps/goong-map-react";
import { useState } from "react";
function PointLocation({location,styleView}) {
    const [Location, setLocation] = useState({
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name,
    });
    const [styleViewState, setStyleViewState] = useState({
        offsetLeft: styleView?.offsetLeft || -10,
        offsetTop: styleView?.offsetTop || -20,
        borderRadius: styleView?.borderRadius || '20%',
        colorLocation: styleView?.colorLocation || 'red',
        fontSize: styleView?.fontSize || 1.25 + 'em',
    });
    


    const [selectedPoint, setSelectedPoint] = useState(null);
    return (
        <>
        <Marker
                    latitude={Location.latitude}
                    longitude={Location.longitude}
                    offsetLeft={styleViewState.offsetLeft}
                    offsetTop={styleViewState.offsetTop}
                  >
                    <div
                      onClick={() => setSelectedPoint({ ...Location, name: location.name})}
                      style={{ cursor: 'pointer', transform: 'translateY(-6px)',borderRadius: styleViewState.borderRadius }}
                    >
                      {/* simple custom marker */}
                      <div style={{ color: styleViewState.colorLocation,fontSize: styleViewState.fontSize}}><i class="fa-solid fa-location-dot"></i> </div>
                    </div>
        </Marker>
        {/* Popup khi click marker */}
        {selectedPoint && (
                  <Popup
                    latitude={selectedPoint.latitude}
                    longitude={selectedPoint.longitude}
                    onClose={() => setSelectedPoint(null)}>
                    <div>
                      <h3>{selectedPoint.name}</h3>
                    </div>
                  </Popup>
                )}
                </>
    );
}
export default PointLocation;