import './style.css';
import React, { useEffect, useState, useMemo } from 'react';
import BusRoute from './component/bus_route';
import { Route } from "../../../models/Route";
import { Time } from '../../../models/Time';
import StyleMain from './../styleMain.module.css';

function renderRoutesTable(routes) {
  return routes.map((route) => (
    <BusRoute key={String(route.id)} route={route} />
  ));
}
function totalRouteStable(array){
  return array.filter(route=>route.status==="stable").length
}
function totalDistance(array){
  return array.reduce((sum,route)=>sum+parseKm(route.totalDistance),0)
}
function parseKm(val) {
    if (val == null) return 0;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const m = val.match(/[\d,.]+/);
      if (!m) return 0;
      return Number(m[0].replace(',', '.'));
    }
    return 0;
  }
function RouteManagementPage() {
  const [routes, setRoutes] = useState([]);
  const [filter, setFilter] = useState('all'); // <-- new state for filter

  useEffect(() => {
    // ví dụ: lấy từ API hoặc dữ liệu tĩnh
    setRoutes([
      new Route("001", "Tuyến A", "Cổng Y", 110, new Time(6, 0), new Time(8, 0), "stable", false),
      new Route("002", "Tuyến B", "Bến Xe", 15, new Time(6, 0), new Time(9, 0), "warning", true),
    ]);
  }, []);
  
  
  // filter logic
  const filteredRoutes = useMemo(() => {
    console.log('Filtering routes with filter:', filter);
    if (filter === 'all') return routes;
    return routes.filter(r => String(r.status).toLowerCase() === String(filter).toLowerCase());
  }, [routes, filter]);
  // tổng chiều dài cho tất cả routes
  const totalDistanceAll = totalDistance(routes)
  const totalDistanceVisible = totalDistance(filteredRoutes)
  const totalRouteStableinlive = totalRouteStable(routes)
  return (
    
    <div className="container-route-management">
      <header>
        <div className={StyleMain.row_direction} style={{ padding:"20px",justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1><i className="fas fa-route" /> Hệ Thống Quản Lý Tuyến Xe</h1>
            <p className="description">Quản lý và theo dõi các tuyến xe hiện có một cách hiệu quả và trực quan</p>
          </div>
          <div><button style={{ color: "white" }}>➕ Thêm Tuyến xe</button></div>
        </div>
      </header>

      <div className={"dashboard " + StyleMain.row_direction}>
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
        <div className="card">
          <i className="fas fa-road" />
          <h3>Tổng quãng đường</h3>
          <div className="number">{totalDistanceAll}</div>
          <div style={{fontSize:12,color:'#6b7280'}}>Hiển thị: {totalDistanceVisible} km</div>
        </div>
      </div>

      <div className="controls">
        <div className="search-container">
          <i className="fas fa-search" />
          <input type="text" className="search-box" placeholder="Tìm kiếm tuyến xe..." />
        </div>
        <div className="filter-container">
          <i className="fas fa-filter" />
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)} // <-- wire up select
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="stable">Ổn định</option>
            <option value="warning">Có vấn đề</option>
            <option value="danger">Ngưng hoạt động</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table id="routes-table" className="routes-table">
          <thead>
            <tr>
              <th><i className="fas fa-hashtag" /> MÃ SỐ TUYẾN</th>
              <th><i className="fas fa-signature" /> TÊN TUYẾN</th>
              <th><i className="fas fa-map-marker-alt" /> TRẠM BẮT ĐẦU</th>
              <th><i className="fas fa-route" /> TỔNG ĐƯỜNG ĐI</th>
              <th><i className="fas fa-clock" /> THỜI GIAN</th>
              <th><i className="fas fa-traffic-light" /> TÌNH TRẠNG</th>
              <th><i className="fas fa-info-circle" /> CHI TIẾT</th>
            </tr>
          </thead>
          <tbody id="routes-body">
                {renderRoutesTable(filteredRoutes)}
          </tbody>
        </table>
      </div>
    </div>
    
  );
}

export default RouteManagementPage;