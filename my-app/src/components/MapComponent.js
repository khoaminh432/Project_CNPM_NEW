import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import axios from "axios";

// Import các hàm xử lý (đảm bảo đường dẫn đúng)
import { khoiTaoBanDo, thietLapTuyen } from "./handleMapSetup.js";
import { xuLyTimKiem } from "./handleSearch.js"; // Chỉ import cái cần dùng

function MapComponent({ searchQuery, searchTrigger, onRouteSelect }) {
  // ================ STATE & REF ================
  const [dsTuyen, setDsTuyen] = useState([]);

  const mapRef = useRef(null);
  const markerXeRef = useRef({});
  const markerTramRef = useRef({});
  const controlTuyenRef = useRef({});
  const dataTuyenRef = useRef({});
  const animRefs = useRef({});
  const polylineRef = useRef({});
  const markerTheoDoiRef = useRef(null);
  const isTheoDoiRef = useRef(false);
  const selectedRouteIdRef = useRef(null);
  const onRouteSelectRef = useRef(onRouteSelect);

  // Cập nhật callback khi prop thay đổi
  useEffect(() => {
    onRouteSelectRef.current = onRouteSelect;
  }, [onRouteSelect]);

  // ================ LẤY DANH SÁCH TUYẾN ================
  useEffect(() => {
    const layDsTuyen = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/vehicle/routes");
        setDsTuyen(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách tuyến đường:", error);
      }
    };
    layDsTuyen();
  }, []);

  // ================ KHỞI TẠO BẢN ĐỒ KHI CÓ DỮ LIỆU ================
  useEffect(() => {
    if (dsTuyen.length === 0 || mapRef.current) return;

    // Tính trung tâm bản đồ
    const allTram = dsTuyen.flatMap(t => t.stops || []);
    if (allTram.length === 0) return;

    const centerLat = allTram.reduce((s, t) => s + t.lat, 0) / allTram.length;
    const centerLng = allTram.reduce((s, t) => s + t.lng, 0) / allTram.length;

    // Khởi tạo bản đồ một lần duy nhất
    const map = khoiTaoBanDo(centerLat, centerLng, mapRef, isTheoDoiRef, markerTheoDoiRef);
    mapRef.current = map; // Gán để lần sau không tạo lại

    // Vẽ tất cả các tuyến
    dsTuyen.forEach(tuyen => {
      if (!tuyen.schedule || tuyen.schedule.length === 0) return;
      thietLapTuyen(
        tuyen,
        map,
        dataTuyenRef,
        markerXeRef,
        markerTramRef,
        controlTuyenRef,
        polylineRef,
        animRefs,
        selectedRouteIdRef,
        onRouteSelectRef,
        mapRef,
        isTheoDoiRef,
        markerTheoDoiRef
      );
    });
  }, [dsTuyen]);

  // ================ TÌM KIẾM ================
  useEffect(() => {
    if (!mapRef.current) return;
    xuLyTimKiem(
      searchQuery,
      mapRef,
      markerXeRef,
      isTheoDoiRef,
      markerTheoDoiRef,
      selectedRouteIdRef,
      onRouteSelectRef,
      dataTuyenRef
    );
  }, [searchTrigger, searchQuery]); // Thêm searchQuery để tránh warning

  // ================ DỌN DẸP KHI UNMOUNT ================
  useEffect(() => {
    return () => {
      Object.values(animRefs.current).forEach(anim => {
        if (anim?.demNguoc) clearInterval(anim.demNguoc);
        if (anim?.animation) clearTimeout(anim.animation);
      });
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // ================ RENDER ================
  return <div id="map" style={{ width: "100%", height: "100%", minHeight: "600px" }} />;
}

export default MapComponent;