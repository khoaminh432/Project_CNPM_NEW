import './style.css';
import React, { useEffect, useState, useMemo } from 'react';
import BusRoute from './component/bus_route';
import { Route,defaultRoutes } from "../../../models/Route";
import { Time } from '../../../models/Time';
import AddRoute from './component/AddRoute';
import StyleMain from './../styleMain.module.css';
import { RouteDetail } from './component/formdetails/Detail_Route';
function renderRoutesTable(routes,handleViewDetail) {
  return routes.map((route) => (
    <BusRoute route={route} onViewDetail={handleViewDetail}/>
  ));
}
function formatNumber2(value) {
  if (value === null || value === undefined || value === '') return '0.00';
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return n.toFixed(2);
}
function parseTimeToModel(inputTime, fallback="00:00") {
    // inputTime có thể là chuỗi "HH:MM" hoặc đối tượng Date
    if (typeof inputTime === 'string') {
      const parts = inputTime.split(':');
      if (parts.length === 2) {
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
      return fallback;
    } else if (inputTime instanceof Date) {
      const hours = inputTime.getHours();
      const minutes = inputTime.getMinutes();
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      return fallback;
    }   
  }

function totalRouteStable(array){
  return array.filter(route=>route.status==="Đang hoạt động").length
}
function RouteManagementPage() {
  const [routes, setRoutes] = useState([]);
  const [filter, setFilter] = useState('all'); // <-- new state for filter
  const [showDetail, setShowDetail] = useState({key:false,value:null});
  const [showaddroute, setShowAddRoute] = useState(false);
  
  const fetchRoutes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/routes');
      const result = await response.json();
      console.log('API Response:', result);
      if (result.status === 'OK' && Array.isArray(result.data)) {
        const routeObjects = result.data.map(r => new Route(r));
        console.log('Route objects:', routeObjects);
        setRoutes(routeObjects);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      setRoutes(defaultRoutes); // fallback to default if API fails
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);
  function editRoute(updated) {
    setRoutes(prev => prev.map(r => {
      if (r.route_id === updated.route_id) {
        return new Route({
          route_id: updated.route_id ?? r.route_id,
          route_name: updated.route_name ?? r.route_name,
          start_point: updated.start_point ?? r.start_point,
          end_point: updated.end_point ?? r.end_point,
          planned_start: updated.planned_start ? parseTimeToModel(updated.planned_start, r.planned_start) : r.planned_start,
          planned_end: updated.planned_end ? parseTimeToModel(updated.planned_end, r.planned_end) : r.planned_end,
          total_students: updated.total_students ?? r.total_students,
          status: updated.status ?? r.status
        });
      }
      return r;
    }));
  }
  const cancelShowAddRoute = () => {
    setShowAddRoute(false);
    fetchRoutes(); // refresh routes after closing add route
  }
  const handleSaveRoute = (newRoute) => {
    editRoute(newRoute);
    setShowDetail({key:false,value:null});
  }
  const handleViewDetail = (route) => {
    setShowDetail({key:true,value: route});
    console.log('Viewing details for route:', route);
  }
  // filter logic
  const filteredRoutes = useMemo(() => {
    console.log('Filtering routes with filter:', filter);
    if (filter === 'all') return routes;
    if (filter === 'active') return routes.filter(r => r.status === 'Đang hoạt động');
    if (filter === 'inactive') return routes.filter(r => r.status === 'Ngưng hoạt động');
    return routes;
  }, [routes, filter]);
  
  const totalRouteStableinlive = totalRouteStable(routes)
  return (
    
    <div className="container-route-management">
      {!showaddroute && 
      <>
      <header>
        <div className={StyleMain.row_direction} style={{justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className={StyleMain.setTitle_h1}><i className="fas fa-route" /> Quản Lý Tuyến Xe</h1>
            <p className="description">Quản lý và theo dõi các tuyến xe hiện có một cách hiệu quả và trực quan</p>
          </div>
          <div><button style={{ color: "white" }} onClick={()=>{setShowAddRoute(true);}}>➕ Thêm Tuyến xe</button></div>
        </div>
      </header>

      <div className={"dashboard-route " + StyleMain.row_direction}>
        <div className="card">
          <i className="fas fa-bus" />
          <h3>Tổng số tuyến xe</h3>
          <div className="number">{routes.length}</div>
        </div>
        <div className="card">
          <i className="fas fa-check-circle" />
          <h3>Tuyến đang hoạt động</h3>
          <div className="number">{totalRouteStableinlive}</div>
        </div>
        <div className="card">
          <i className="fas fa-exclamation-triangle" />
          <h3>Tuyến cần chú ý</h3>
          <div className="number">{routes.length-totalRouteStableinlive}</div>
        </div>
      </div>

      <div className="controls">
        <div className="search-container">
          <i className="fas fa-search" />
          <input style={{fontSize:"1.1em"}} type="text" className="search-box" placeholder="Tìm kiếm tuyến xe..." />
        </div>
        <div className="filter-container">
          <i className="fas fa-filter" />
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)} // <-- wire up select
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table id="routes-table" className="routes-table">
          <thead>
            <tr>
              <th><i className="fas fa-hashtag" /> MÃ TUYẾN</th>
              <th><i className="fas fa-signature" /> TÊN TUYẾN</th>
              <th><i className="fas fa-map-marker-alt" /> ĐIỂM BẮT ĐẦU</th>
              <th><i className="fas fa-map-marker-alt" /> ĐIỂM KẾT THÚC</th>
              <th><i className="fas fa-clock" /> THỜI GIAN</th>
              <th><i className="fa-solid fa-person"></i> SỐ HỌC SINH</th>
              <th><i className="fas fa-traffic-light" /> TÌNH TRẠNG</th>
              <th><i className="fas fa-info-circle" /> CHI TIẾT</th>
            </tr>
          </thead>
          <tbody id="routes-body">
                {renderRoutesTable(filteredRoutes,handleViewDetail)}
          </tbody>
        </table>
        {showDetail.key && (
          <RouteDetail
            route={showDetail.value} // ví dụ: hiển thị chi tiết của tuyến đầu tiên  
            onClose={() => setShowDetail({key:false,value:null})}
            onSave={handleSaveRoute}
            />)}
      </div>
      </>
      }
      {showaddroute && (
        <AddRoute
         onclose={cancelShowAddRoute}
        />
      )}
      
    </div>
    
  );
}

export default RouteManagementPage;