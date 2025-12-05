import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "../Assets/CSS/index.css";
import "../Assets/CSS/drivermap.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";

// Import local images
import imgAvatar from "../Assets/images/imgAvatar.png";
import imgEllipse1 from "../Assets/images/imgEllipse1.svg";
import imgEllipse2 from "../Assets/images/dv_ec.svg";
import imgVector from "../Assets/images/dv_nav.svg";
import imgStar1 from "../Assets/images/imgStar1.svg";
import imgVector3 from "../Assets/images/imgVector1.svg";
import imgGroup104 from "../Assets/images/imgGroup104.svg";

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom blue marker for driver
const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom green marker for start point
const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom red marker for end point
const endIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom orange marker for pickup stops
const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom violet marker for dropoff stops
const dropoffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to update map center
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function DriverMap({ onBackToMain, onNavigateToList }) {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("Bạn đang offline.");
  const [showReportModal, setShowReportModal] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [reportFormData, setReportFormData] = useState({
    title: "",
    content: "",
  });
  const [currentPosition, setCurrentPosition] = useState([10.762622, 106.660172]); // TP.HCM default
  const [mapCenter, setMapCenter] = useState([10.762622, 106.660172]);
  const [mapZoom, setMapZoom] = useState(13);
  const [earliestSchedule, setEarliestSchedule] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [totalStops, setTotalStops] = useState(0);
  const [stopsDetails, setStopsDetails] = useState([]);
  const [studentsByStop, setStudentsByStop] = useState([]);
  const [driverRating, setDriverRating] = useState('5.00');
  const [popup, setPopup] = useState({ show: false, type: 'success', title: '', message: '' });
  const [routePolyline, setRoutePolyline] = useState([]);
  const [busPosition, setBusPosition] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(-1);
  const [waitingAtStop, setWaitingAtStop] = useState(false);
  const animationRef = useRef(null);
  const checkIntervalRef = useRef(null);

  // Show popup notification
  const showPopup = (type, title, message) => {
    setPopup({ show: true, type, title, message });
    setTimeout(() => {
      setPopup({ show: false, type: 'success', title: '', message: '' });
    }, 3000);
  };

  // Helper function to format time with offset
  const formatTimeWithOffset = (startTime, offsetMinutes) => {
    if (!startTime) return '--:--';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + offsetMinutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  };

  // Helper function to get badge text
  const getBadgeText = (stopType, index, totalCount) => {
    if (index === 0) return 'Bắt đầu';
    if (index === totalCount - 1) return 'Kết thúc';
    return stopType;
  };

  // Helper function to get marker icon
  const getMarkerIcon = (stopType) => {
    if (stopType === 'start') return startIcon;
    if (stopType === 'end') return endIcon;
    if (stopType === 'Điểm đón') return pickupIcon;
    if (stopType === 'Điểm trả') return dropoffIcon;
    return driverIcon;
  };

  // --- Handle Report Modal ---
  const handleReportClick = () => {
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setReportFormData({
      title: "",
      content: "",
    });
  };

  // --- Handle Start/End Trip ---
  const handleStartEndTrip = async () => {
    if (!earliestSchedule) return;

    try {
      const isStarting = earliestSchedule.status === 'Chưa bắt đầu';
      
      // If ending the trip, check if all students are dropped off
      if (!isStarting) {
        const checkResponse = await fetch(`http://localhost:5000/api/students/schedule/${earliestSchedule.schedule_id}/check-completion`);
        const checkData = await checkResponse.json();
        
        if (!checkData.canComplete) {
          showPopup('error', 'Không thể kết thúc chuyến đi', 
            `${checkData.message}\nChờ đón: ${checkData.waiting} | Đã đón: ${checkData.picked_up}`);
          return;
        }
      }

      const newStatus = isStarting ? 'Đang thực hiện' : 'Hoàn thành';
      const endpoint = isStarting ? 'start' : 'end';

      const response = await fetch(`http://localhost:5000/api/schedules/${earliestSchedule.schedule_id}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.status === 'OK') {
        // Update schedule status in state
        setEarliestSchedule(prev => ({
          ...prev,
          status: newStatus,
          start_time: isStarting ? new Date().toISOString() : prev.start_time,
          end_time: !isStarting ? new Date().toISOString() : prev.end_time
        }));
        
        // If starting trip, create polyline and start bus simulation
        if (isStarting && stopsDetails.length > 0) {
          const routeCoordinates = stopsDetails
            .filter(stop => stop.latitude && stop.longitude)
            .map(stop => [stop.latitude, stop.longitude]);
          
          if (routeCoordinates.length > 0) {
            setRoutePolyline(routeCoordinates);
            setBusPosition(routeCoordinates[0]);
            setCurrentStopIndex(0);
            
            // Save simulation state AND stops details to localStorage
            localStorage.setItem('busSimulation', JSON.stringify({
              scheduleId: earliestSchedule.schedule_id,
              routeCoordinates: routeCoordinates,
              stopsDetails: stopsDetails, // Save stops details to preserve marker positions
              currentStopIndex: 0,
              isActive: true,
              busPosition: routeCoordinates[0]
            }));
            
            startBusSimulation(routeCoordinates, 0);
          }
        }
        
        // If ending trip, stop simulation
        if (!isStarting) {
          stopBusSimulation();
          setRoutePolyline([]);
          setBusPosition(null);
          setCurrentStopIndex(-1);
          setWaitingAtStop(false);
          
          // Clear simulation state from localStorage
          localStorage.removeItem('busSimulation');
        }
        
        showPopup('success', 'Thành công', 
          isStarting ? 'Bắt đầu chuyến đi thành công!' : 'Kết thúc chuyến đi thành công!');
      } else {
        showPopup('error', 'Lỗi', data.message);
      }
    } catch (error) {
      console.error('Error updating trip status:', error);
      showPopup('error', 'Lỗi', 'Không thể cập nhật trạng thái. Vui lòng thử lại.');
    }
  };

  // Start bus simulation animation
  const startBusSimulation = (routeCoordinates, startIndex = 0) => {
    if (routeCoordinates.length < 2 || startIndex >= routeCoordinates.length - 1) return;
    
    setIsSimulating(true);
    let currentSegment = startIndex;
    let progress = 0;
    const speed = 0.002; // Adjust speed (smaller = slower)
    
    const animate = () => {
      if (currentSegment >= routeCoordinates.length - 1) {
        // Reached the end
        setBusPosition(routeCoordinates[routeCoordinates.length - 1]);
        setCurrentStopIndex(routeCoordinates.length - 1);
        setIsSimulating(false);
        
        // Update localStorage
        const simState = JSON.parse(localStorage.getItem('busSimulation') || '{}');
        simState.currentStopIndex = routeCoordinates.length - 1;
        simState.busPosition = routeCoordinates[routeCoordinates.length - 1];
        simState.isActive = false;
        localStorage.setItem('busSimulation', JSON.stringify(simState));
        return;
      }
      
      const start = routeCoordinates[currentSegment];
      const end = routeCoordinates[currentSegment + 1];
      
      // Linear interpolation
      const lat = start[0] + (end[0] - start[0]) * progress;
      const lng = start[1] + (end[1] - start[1]) * progress;
      
      setBusPosition([lat, lng]);
      
      progress += speed;
      
      if (progress >= 1) {
        // Reached next stop
        currentSegment++;
        progress = 0;
        
        // Check if this stop requires waiting (not start or end point)
        const stopInfo = stopsDetails[currentSegment];
        if (stopInfo && (stopInfo.stop_type === 'Điểm đón' || stopInfo.stop_type === 'Điểm trả')) {
          // Stop and wait for student pickup/dropoff
          setBusPosition(routeCoordinates[currentSegment]);
          setCurrentStopIndex(currentSegment);
          setWaitingAtStop(true);
          setIsSimulating(false);
          
          // Update localStorage
          const simState = JSON.parse(localStorage.getItem('busSimulation') || '{}');
          simState.currentStopIndex = currentSegment;
          simState.busPosition = routeCoordinates[currentSegment];
          simState.waitingAtStop = true;
          simState.currentStopId = stopInfo.stop_id;
          simState.currentStopType = stopInfo.stop_type;
          localStorage.setItem('busSimulation', JSON.stringify(simState));
          
          // Start checking student status
          startCheckingStudentStatus(stopInfo.stop_id, stopInfo.stop_type, routeCoordinates, currentSegment);
          return;
        } else {
          setCurrentStopIndex(currentSegment);
          
          // Update localStorage
          const simState = JSON.parse(localStorage.getItem('busSimulation') || '{}');
          simState.currentStopIndex = currentSegment;
          simState.busPosition = routeCoordinates[currentSegment];
          simState.waitingAtStop = false;
          localStorage.setItem('busSimulation', JSON.stringify(simState));
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Check if all students at stop have been picked up/dropped off
  const startCheckingStudentStatus = async (stopId, stopType, routeCoordinates, stopIndex) => {
    const checkStatus = async () => {
      try {
        if (!earliestSchedule) return;

        const response = await fetch(
          `http://localhost:5000/api/students/schedule/${earliestSchedule.schedule_id}/stop/${stopId}/status`
        );
        const data = await response.json();

        if (data.status === 'OK') {
          const allCompleted = stopType === 'Điểm đón' 
            ? data.data.all_picked_up 
            : data.data.all_dropped_off;

          if (allCompleted) {
            // All students processed, continue bus movement
            clearInterval(checkIntervalRef.current);
            setWaitingAtStop(false);
            setIsSimulating(true);
            
            // Continue to next segment
            if (stopIndex < routeCoordinates.length - 1) {
              startBusSimulation(routeCoordinates, stopIndex);
            }
          }
        }
      } catch (error) {
        console.error('Error checking student status:', error);
      }
    };

    // Check immediately and then every 2 seconds
    checkStatus();
    checkIntervalRef.current = setInterval(checkStatus, 2000);
  };

  // Stop bus simulation
  const stopBusSimulation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
    setIsSimulating(false);
    setWaitingAtStop(false);
  };

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      stopBusSimulation();
    };
  }, []);

  const handleReportFormChange = (field, value) => {
    setReportFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitReport = async () => {
    if (!reportFormData.title || !reportFormData.content) {
      showPopup('warning', 'Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const driverId = user.driver_id;
      const driverName = user.name || 'Tài xế';

      // Create notification for system
      const response = await fetch('http://localhost:5000/api/notifications/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: reportFormData.title,
          content: reportFormData.content,
          recipient_type: 'system',
          type: 'manual',
          sender_id: driverId,
          sender_name: driverName
        }),
      });

      const data = await response.json();

      if (data.success) {
        showPopup('success', 'Thành công', 'Báo cáo đã được gửi thành công!');
        handleCloseReportModal();
      } else {
        showPopup('error', 'Lỗi', 'Không thể gửi báo cáo: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      showPopup('error', 'Lỗi', 'Không thể gửi báo cáo. Vui lòng thử lại.');
    }
  };

  // --- Handle Stop Counter Modal ---
  const handleStopCounterClick = () => {
    setShowStopModal(true);
  };

  const handleCloseStopModal = () => {
    setShowStopModal(false);
  };

  // --- Khi nhấn Bật / Ngắt kết nối ---
  const handleConnectClick = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const driverId = user.driver_id;

      if (!driverId) return;

      const newStatus = !connected ? 'Đang hoạt động' : 'Tạm nghỉ';
      
      const response = await fetch(`http://localhost:5000/api/drivers/${driverId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.status === 'OK') {
        setConnected(!connected);
        setStatus(!connected ? 'Bạn đang online.' : 'Bạn đang offline.');
        
        // If connecting, fetch earliest schedule
        if (!connected) {
          console.log('Fetching earliest schedule for driver:', driverId);
          const scheduleResponse = await fetch(`http://localhost:5000/api/schedules/today/earliest/${driverId}`);
          const scheduleData = await scheduleResponse.json();
          
          console.log('Schedule data received:', scheduleData);
          
          if (scheduleData.status === 'OK' && scheduleData.data) {
            setEarliestSchedule(scheduleData.data);
            
            console.log('Start marker:', scheduleData.data.start_location_lat, scheduleData.data.start_location_lng);
            console.log('End marker:', scheduleData.data.end_location_lat, scheduleData.data.end_location_lng);
            
            // Fetch student count for this schedule from student_pickup table
            try {
              const studentResponse = await fetch(`http://localhost:5000/api/students/schedule/${scheduleData.data.schedule_id}`);
              const studentData = await studentResponse.json();
              if (studentData.status === 'OK') {
                setStudentCount(studentData.count || 0);
              }
            } catch (error) {
              console.error('Error fetching student count:', error);
            }
            
            // Fetch total stops for this schedule
            try {
              const stopsResponse = await fetch(`http://localhost:5000/api/students/schedule/${scheduleData.data.schedule_id}/stops`);
              const stopsData = await stopsResponse.json();
              if (stopsData.status === 'OK') {
                setTotalStops(stopsData.total_stops || 0);
              }
            } catch (error) {
              console.error('Error fetching total stops:', error);
            }
            
            // Fetch detailed stops information
            // Check if there's already a saved simulation with stops details
            const savedSimulation = localStorage.getItem('busSimulation');
            let shouldFetchStops = true;
            
            if (savedSimulation) {
              try {
                const simState = JSON.parse(savedSimulation);
                if (simState.scheduleId === scheduleData.data.schedule_id && 
                    simState.isActive && 
                    simState.stopsDetails && 
                    simState.stopsDetails.length > 0) {
                  // Use saved stops details instead of fetching new ones
                  console.log('Using saved stops details from simulation');
                  setStopsDetails(simState.stopsDetails);
                  shouldFetchStops = false;
                }
              } catch (e) {
                console.error('Error reading saved simulation:', e);
              }
            }
            
            if (shouldFetchStops) {
              try {
                const detailsResponse = await fetch(`http://localhost:5000/api/students/schedule/${scheduleData.data.schedule_id}/stops/details`);
                const detailsData = await detailsResponse.json();
                console.log('Stops details received:', detailsData);
                if (detailsData.status === 'OK') {
                  console.log('Stops array:', detailsData.data.stops);
                  setStopsDetails(detailsData.data.stops || []);
                }
              } catch (error) {
                console.error('Error fetching stops details:', error);
              }
            }

            // Fetch students grouped by stops for student list modal
            try {
              const studentsResponse = await fetch(`http://localhost:5000/api/students/schedule/${scheduleData.data.schedule_id}/students-by-stop`);
              const studentsData = await studentsResponse.json();
              console.log('Students by stop received:', studentsData);
              if (studentsData.status === 'OK') {
                console.log('Students array length:', studentsData.data.stops.length);
                console.log('Students detail:', JSON.stringify(studentsData.data.stops, null, 2));
                setStudentsByStop(studentsData.data.stops || []);
              } else {
                console.error('Failed to fetch students by stop:', studentsData.message);
              }
            } catch (error) {
              console.error('Error fetching students by stop:', error);
            }
            
            // Center map to show route
            if (scheduleData.data.start_location_lat && scheduleData.data.start_location_lng) {
              setMapCenter([scheduleData.data.start_location_lat, scheduleData.data.start_location_lng]);
              setMapZoom(12);
            }
          } else {
            console.log('No schedule found for today');
            showPopup('info', 'Không có chuyến', 'Không có chuyến đi nào cho hôm nay.');
          }
        } else {
          // Clear markers when disconnecting
          setEarliestSchedule(null);
          setStudentCount(0);
          setTotalStops(0);
          setStopsDetails([]);
          setStudentsByStop([]);
          setMapCenter([10.762622, 106.660172]);
          setMapZoom(13);
        }
      } else {
        console.error('Failed to update status:', data.message);
        showPopup('error', 'Lỗi cập nhật', 'Không thể cập nhật trạng thái. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error updating driver status:', error);
      showPopup('error', 'Lỗi kết nối', 'Lỗi kết nối. Vui lòng thử lại.');
    }
  };

  // Fetch driver status on mount
  useEffect(() => {
    const fetchDriverStatus = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;

        const user = JSON.parse(userStr);
        const driverId = user.driver_id;

        if (!driverId) return;

        const response = await fetch(`http://localhost:5000/api/drivers/${driverId}`);
        const data = await response.json();

        if (data.status === 'OK') {
          const isActive = data.data.status === 'Đang hoạt động';
          setConnected(isActive);
          setStatus(isActive ? 'Bạn đang online.' : 'Bạn đang offline.');
          
          // Set driver rating
          if (data.data.rating) {
            setDriverRating(parseFloat(data.data.rating).toFixed(2));
          }
          
          // If active, fetch earliest schedule
          if (isActive) {
            const scheduleResponse = await fetch(`http://localhost:5000/api/schedules/today/earliest/${driverId}`);
            const scheduleData = await scheduleResponse.json();
            
            if (scheduleData.status === 'OK' && scheduleData.data) {
              setEarliestSchedule(scheduleData.data);
              
              // Fetch student count for this schedule from student_pickup table
              try {
                const studentResponse = await fetch(`http://localhost:5000/api/students/schedule/${scheduleData.data.schedule_id}`);
                const studentData = await studentResponse.json();
                if (studentData.status === 'OK') {
                  setStudentCount(studentData.count || 0);
                }
              } catch (error) {
                console.error('Error fetching student count:', error);
              }
              
              // Fetch total stops for this schedule
              try {
                const stopsResponse = await fetch(`http://localhost:5000/api/students/schedule/${scheduleData.data.schedule_id}/stops`);
                const stopsData = await stopsResponse.json();
                if (stopsData.status === 'OK') {
                  setTotalStops(stopsData.total_stops || 0);
                }
              } catch (error) {
                console.error('Error fetching total stops:', error);
              }
              
              // Fetch detailed stops information
              let stopsData = [];
              try {
                const detailsResponse = await fetch(`http://localhost:5000/api/students/schedule/${scheduleData.data.schedule_id}/stops/details`);
                const detailsData = await detailsResponse.json();
                console.log('Stops details received (useEffect):', detailsData);
                if (detailsData.status === 'OK') {
                  console.log('Stops array (useEffect):', detailsData.data.stops);
                  stopsData = detailsData.data.stops || [];
                  setStopsDetails(stopsData);
                }
              } catch (error) {
                console.error('Error fetching stops details:', error);
              }

              // Fetch students grouped by stops for student list modal
              try {
                const studentsResponse = await fetch(`http://localhost:5000/api/students/schedule/${scheduleData.data.schedule_id}/students-by-stop`);
                const studentsData = await studentsResponse.json();
                console.log('Students by stop received (useEffect):', studentsData);
                if (studentsData.status === 'OK') {
                  console.log('Students array length (useEffect):', studentsData.data.stops.length);
                  console.log('Students detail (useEffect):', JSON.stringify(studentsData.data.stops, null, 2));
                  setStudentsByStop(studentsData.data.stops || []);
                } else {
                  console.error('Failed to fetch students by stop (useEffect):', studentsData.message);
                }
              } catch (error) {
                console.error('Error fetching students by stop (useEffect):', error);
              }
              
              // Center map to show route
              if (scheduleData.data.start_location_lat && scheduleData.data.start_location_lng) {
                setMapCenter([scheduleData.data.start_location_lat, scheduleData.data.start_location_lng]);
                setMapZoom(12);
              }
              
              // Check if there's a saved simulation state and restore it
              const savedSimulation = localStorage.getItem('busSimulation');
              if (savedSimulation) {
                try {
                  const simState = JSON.parse(savedSimulation);
                  
                  // Only restore if it's for the same schedule
                  if (simState.scheduleId === scheduleData.data.schedule_id && simState.isActive) {
                    console.log('Restoring simulation state:', simState);
                    
                    // Use saved stops details instead of freshly fetched data
                    if (simState.stopsDetails && simState.stopsDetails.length > 0) {
                      setStopsDetails(simState.stopsDetails);
                      stopsData = simState.stopsDetails; // Override with saved data
                    }
                    
                    // Restore immediately since we have the data
                    setRoutePolyline(simState.routeCoordinates);
                    setBusPosition(simState.busPosition);
                    setCurrentStopIndex(simState.currentStopIndex);
                    
                    if (simState.waitingAtStop && simState.currentStopId && simState.currentStopType) {
                      setWaitingAtStop(true);
                      // Resume checking student status with saved stop info
                      setTimeout(() => {
                        startCheckingStudentStatus(
                          simState.currentStopId, 
                          simState.currentStopType, 
                          simState.routeCoordinates, 
                          simState.currentStopIndex
                        );
                      }, 500);
                    } else if (!simState.isComplete) {
                      // Check if current position is at a pickup/dropoff stop
                      const currentStop = simState.stopsDetails ? simState.stopsDetails[simState.currentStopIndex] : null;
                      
                      if (currentStop && (currentStop.stop_type === 'Điểm đón' || currentStop.stop_type === 'Điểm trả')) {
                        // We're at a stop that requires waiting, start checking
                        setWaitingAtStop(true);
                        setTimeout(() => {
                          startCheckingStudentStatus(
                            currentStop.stop_id, 
                            currentStop.stop_type, 
                            simState.routeCoordinates, 
                            simState.currentStopIndex
                          );
                        }, 500);
                      } else {
                        // Not at a waiting stop, resume animation from current position
                        setTimeout(() => {
                          startBusSimulation(simState.routeCoordinates, simState.currentStopIndex);
                        }, 500);
                      }
                    }
                  }
                } catch (e) {
                  console.error('Error restoring simulation:', e);
                  localStorage.removeItem('busSimulation');
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching driver status:', error);
      }
    };

    fetchDriverStatus();
  }, []);

  return (
    <div className="driver-map-root">
      {/* Header */}
      <header className="dm-header">
        <button
          className="dm-back-btn"
          aria-label="Quay lại"
          onClick={() => onBackToMain && onBackToMain()}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 6L9 12L15 18"
              stroke="#111827"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

      {/* Map */}
      <main className="dm-map-container" role="region" aria-label="Bản đồ">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={mapCenter} zoom={mapZoom} />
          
          {/* Render polyline route when trip is started */}
          {routePolyline.length > 0 && (
            <Polyline 
              positions={routePolyline} 
              color="#0073FB" 
              weight={4}
              opacity={0.7}
            />
          )}
          
          {/* Render all stop markers from stopsDetails */}
          {connected && stopsDetails.length > 0 && stopsDetails.map((stop, index) => {
            console.log(`Marker ${index}:`, stop.stop_name, stop.latitude, stop.longitude, stop.stop_type);
            return stop.latitude && stop.longitude ? (
              <Marker 
                key={index} 
                position={[stop.latitude, stop.longitude]} 
                icon={getMarkerIcon(stop.stop_type)}
              >
                <Popup>
                  <strong>{getBadgeText(stop.stop_type, index, stopsDetails.length)}</strong><br/>
                  {stop.stop_name}<br/>
                  {stop.student_count > 0 && (
                    <span style={{ color: '#666' }}>{stop.student_count} học sinh</span>
                  )}
                </Popup>
              </Marker>
            ) : null;
          })}
          
          {/* Render animated bus marker when simulation is active */}
          {busPosition && (
            <Marker position={busPosition} icon={driverIcon}>
              <Popup>
                Xe bus đang di chuyển
              </Popup>
            </Marker>
          )}
          
          {/* Static driver position when not simulating */}
          {connected && currentPosition && !busPosition && (
            <Marker position={currentPosition} icon={driverIcon}>
              <Popup>
                Vị trí hiện tại của bạn
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Center control: Connect button */}
        <div className={`dm-center-control ${connected ? 'connected-state' : ''}`}>
          <button
            className={`dm-connect-btn ${connected ? "connected" : ""}`}
            onClick={handleConnectClick}
            aria-pressed={connected}
          >
            <FontAwesomeIcon
              icon={faPowerOff}
              color="white"
              size="lg"
            />
          </button>
        </div>

        {/* Top left back button with icon */}
        <div className="dm-top-left-btn" onClick={() => onBackToMain && onBackToMain()}>
          <img src={imgGroup104} alt="menu" />
        </div>

        {/* Profile Section - Top Right (always visible) */}
        <div className="dm-profile-section">
          <div className="dm-profile-avatar">
            <img src={imgAvatar} alt="avatar" />
          </div>
          <div className="dm-profile-rating">
            <img src={imgStar1} alt="star" className="dm-star-icon" />
            <span className="dm-rating-text">{driverRating}</span>
          </div>
        </div>

        {/* Control Panel - Shows when connected */}
        {connected && (
          <div className="dm-control-panel">
            {/* Top Bar */}
            <div className="dm-top-bar">
              <div 
                className="dm-stop-counter" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleStopCounterClick();
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="dm-stop-badge">
                  <img src={imgEllipse1} alt="badge" className="dm-badge-bg" />
                  <span className="dm-stop-number">{totalStops}</span>
                </div>
                <p className="dm-stop-label">Trạm dừng</p>
              </div>

              <div className="dm-center-info">
                <div className="dm-logo">SSB</div>
              </div>
            </div>

{/*
              <div className="dm-navigation-btn">
                <div className="dm-nav-badge">
                  <img src={imgEllipse2} alt="badge" className="dm-badge-bg" />
                  <img src={imgVector} alt="nav" className="dm-nav-icon" />
                </div>
                <p className="dm-nav-label">Điều hướng</p>
              </div>
            </div>
*/}
            <div className="dm-divider"></div>

            {/* Info Cards */}
            <div className="dm-info-cards">
              <div className="dm-info-card">
                <p className="dm-card-label">Tuyến</p>
                <p className="dm-card-value">{earliestSchedule?.route_name || '--'}</p>
              </div>

              <div className="dm-info-card">
                <p className="dm-card-label">Học sinh</p>
                <p className="dm-card-value">{studentCount}</p>
              </div>

              <div className="dm-info-card dm-card-route">
                <p className="dm-route-text">{earliestSchedule?.start_point || 'Chưa có'}</p>
                <p className="dm-route-divider">-</p>
                <p className="dm-route-text">{earliestSchedule?.end_point || 'Chưa có'}</p>
              </div>

              <div className="dm-info-card">
                <p className="dm-card-time">
                  {earliestSchedule?.planned_start && earliestSchedule?.planned_end 
                    ? `${earliestSchedule.planned_start.substring(0,5)} - ${earliestSchedule.planned_end.substring(0,5)}`
                    : '--:-- - --:--'
                  }
                </p>
              </div>

              <div className="dm-info-card dm-card-price">
                <p className="dm-price-text">32,000 VND/người</p>
              </div>
            </div>
            <div className="dm-divider"></div>

            {/* Action Buttons */}
            <div className="dm-action-buttons">
              <button 
                className="dm-action-btn dm-btn-primary"
                onClick={handleStartEndTrip}
                disabled={!earliestSchedule || earliestSchedule.status === 'Hoàn thành'}
              >
                {earliestSchedule?.status === 'Chưa bắt đầu' ? 'Bắt đầu' : 
                 earliestSchedule?.status === 'Đang thực hiện' ? 'Kết thúc' : 
                 'Hoàn thành'}
              </button>
              <button className="dm-action-btn" onClick={handleReportClick}>
                Báo cáo sự cố
              </button>
              <button 
                className="dm-action-btn" 
                onClick={() => onNavigateToList && onNavigateToList(earliestSchedule?.schedule_id)}
              >
                Danh sách học sinh
              </button>
              <button className="dm-action-btn" onClick={() => setShowEmergencyModal(true)}>
                Hỗ trợ khán cấp
              </button>
            </div>
          </div>
        )}

        {/* Bottom status bar */}
        {!connected && (
          <div className="dm-bottom-status">
            <div className="dm-status-text">
              <div className="dm-status-line1">{status}</div>
              <div className="dm-status-line2">SSB</div>
            </div>
          </div>
        )}

        {/* Report Issue Modal */}
        {showReportModal && (
          <div className="dm-modal-overlay" onClick={handleCloseReportModal}>
            <div className="dm-modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="dm-modal-header">
                <svg
                  className="dm-modal-warning-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                    fill="currentColor"
                  />
                </svg>
                <h2 className="dm-modal-title">Báo cáo sự cố</h2>
              </div>

              {/* Modal Body */}
              <div className="dm-modal-body">
                {/* Title */}
                <div className="dm-form-group">
                  <label className="dm-form-label">Tiêu đề</label>
                  <div className="dm-form-input-wrapper">
                    <select
                      className="dm-form-input dm-form-select"
                      value={reportFormData.title}
                      onChange={(e) => handleReportFormChange("title", e.target.value)}
                    >
                      <option value="">Chọn loại sự cố</option>
                      <option value="Tai nạn giao thông">Tai nạn giao thông</option>
                      <option value="Ùn tắc giao thông">Ùn tắc giao thông</option>
                      <option value="Sự cố xe">Sự cố xe</option>
                      <option value="Học sinh bị thương">Học sinh bị thương</option>
                      <option value="Mất trật tự trên xe">Mất trật tự trên xe</option>
                      <option value="Chậm trễ">Chậm trễ</option>
                      <option value="Thời tiết xấu">Thời tiết xấu</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                {/* Content */}
                <div className="dm-form-group">
                  <label className="dm-form-label">Nội dung</label>
                  <div className="dm-form-input-wrapper">
                    <textarea
                      className="dm-form-input dm-form-textarea"
                      value={reportFormData.content}
                      onChange={(e) => handleReportFormChange("content", e.target.value)}
                      placeholder="Mô tả chi tiết về sự cố"
                      rows="6"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="dm-modal-footer">
                <button
                  className="dm-modal-btn dm-btn-cancel"
                  onClick={handleCloseReportModal}
                >
                  Hủy
                </button>
                <button
                  className="dm-modal-btn dm-btn-confirm"
                  onClick={handleSubmitReport}
                  disabled={!reportFormData.title || !reportFormData.content}
                >
                  Xác nhận báo cáo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stop Counter Modal */}
        {showStopModal && (
          <div className="dm-modal-overlay" onClick={handleCloseStopModal}>
            <div className="dm-figma-stop-modal" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="dm-figma-header">
                <div className="dm-figma-title-wrapper">
                  <svg className="dm-figma-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M576 160C576 210.2 516.9 285.1 491.4 315C487.6 319.4 482 321.1 476.9 320L384 320C366.3 320 352 334.3 352 352C352 369.7 366.3 384 384 384L480 384C533 384 576 427 576 480C576 533 533 576 480 576L203.6 576C212.3 566.1 222.9 553.4 233.6 539.2C239.9 530.8 246.4 521.6 252.6 512L480 512C497.7 512 512 497.7 512 480C512 462.3 497.7 448 480 448L384 448C331 448 288 405 288 352C288 299 331 256 384 256L423.8 256C402.8 224.5 384 188.3 384 160C384 107 427 64 480 64C533 64 576 107 576 160zM181.1 553.1C177.3 557.4 173.9 561.2 171 564.4L169.2 566.4L169 566.2C163 570.8 154.4 570.2 149 564.4C123.8 537 64 466.5 64 416C64 363 107 320 160 320C213 320 256 363 256 416C256 446 234.9 483 212.5 513.9C201.8 528.6 190.8 541.9 181.7 552.4L181.1 553.1zM192 416C192 398.3 177.7 384 160 384C142.3 384 128 398.3 128 416C128 433.7 142.3 448 160 448C177.7 448 192 433.7 192 416zM480 192C497.7 192 512 177.7 512 160C512 142.3 497.7 128 480 128C462.3 128 448 142.3 448 160C448 177.7 462.3 192 480 192z"/>
                  </svg>
                  <h2 className="dm-figma-title">Các trạm cần đến</h2>
                </div>
                <button
                  className="dm-figma-close"
                  onClick={handleCloseStopModal}
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>

              {/* Stops List */}
              <div className="dm-figma-stops">
                {stopsDetails.length > 0 ? (
                  stopsDetails.map((stop, index) => (
                    <div key={index} className="dm-figma-stop-item">
                      <div className="dm-figma-stop-circle">{index + 1}</div>
                      <div className="dm-figma-stop-content">
                        <p className="dm-figma-stop-name">{stop.stop_name}</p>
                        <p className="dm-figma-stop-address">{stop.stop_name}</p>
                        <div className="dm-figma-stop-details">
                          <span className="dm-figma-stop-time">
                            {formatTimeWithOffset(earliestSchedule?.planned_start, stop.time_offset)}
                          </span>
                          <span className="dm-figma-stop-badge">
                            {getBadgeText(stop.stop_type, index, stopsDetails.length)}
                          </span>
                          <span className="dm-figma-stop-count">
                            {stop.student_count > 0 ? `${stop.student_count} học sinh` : ''}
                          </span>
                        </div>
                      </div>
                      {index < stopsDetails.length - 1 && <div className="dm-figma-stop-line"></div>}
                    </div>
                  ))
                ) : (
                  <div className="dm-figma-stop-item">
                    <div className="dm-figma-stop-content">
                      <p className="dm-figma-stop-name">Chưa có thông tin trạm dừng</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Emergency Support Modal */}
        {showEmergencyModal && (
          <div className="dm-modal-overlay" onClick={() => setShowEmergencyModal(false)}>
            <div className="dm-modal-content" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="dm-modal-header">
                <svg
                  className="dm-modal-warning-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
                    fill="currentColor"
                  />
                </svg>
                <h2>Hỗ trợ khẩn cấp</h2>
                <button
                  className="dm-modal-close-btn"
                  onClick={() => setShowEmergencyModal(false)}
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <div className="dm-modal-body">
                <p className="dm-emergency-label">Liên hệ với bộ phận hỗ trợ khẩn cấp:</p>
                <p className="dm-emergency-phone">0842498241</p>
                <button 
                  className="dm-emergency-call-btn"
                  onClick={() => window.location.href = 'tel:0842498241'}
                >
                  Gọi ngay
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Popup Notification */}
        {popup.show && (
          <div className="dm-popup-overlay">
            <div className={`dm-popup dm-popup-${popup.type}`}>
              <h3>{popup.title}</h3>
              <p>{popup.message}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
