import React, { useEffect } from "react";

function MapComponent() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCGw-UAp-Jx5DEGDCtIXdI1N5ScdU1q7Q8&callback=initMap";
    script.async = true;
    window.initMap = initMap;
    document.body.appendChild(script);
  }, []);

  function initMap() {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 10.762622, lng: 106.660172 },
      zoom: 14,
    });

    new window.google.maps.Marker({
      position: { lat: 10.762622, lng: 106.660172 },
      map,
      title: "Vị trí của tôi",
    });
  }

  return <div id="map" style={{ width: "100%", height: "400px" }} />;
}

export default MapComponent;
