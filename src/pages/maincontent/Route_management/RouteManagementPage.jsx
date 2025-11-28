import './style.css';
import React, { useEffect, useState, useMemo } from 'react';
import BusRoute from './component/bus_route';
import { Route } from "../../../models/Route";
import { Time } from '../../../models/Time';
import StyleMain from './../styleMain.module.css';
import { RouteDetail } from './component/formdetails/Detail_Route';
function renderRoutesTable(routes,handleViewDetail) {
  return routes.map((route) => (
    <BusRoute route={route} onViewDetail={handleViewDetail}/>
  ));
}
function totalRouteStable(array){
  return array.filter(route=>route.status==="active").length
}
function totalDistance(array){
  return array.reduce((sum,route)=>sum+parseKm(route.distance_km),0)
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
  const [showDetail, setShowDetail] = useState({key:false,value:null});
  useEffect(() => {
    // ví dụ: lấy từ API hoặc dữ liệu tĩnh
    setRoutes([
      new Route(1, 'R001', 'Tuyến 1', 'Trạm A', 'Trạm B', new Time(7, 0), new Time(8, 0), 30, 15, 45, 'active', new Date(), new Date()),
      new Route(2, 'R002', 'Tuyến 2', 'Trạm C', 'Trạm D', new Time(9, 0), new Time(10, 0), 25, 10, 35, 'inactive', new Date(), new Date()),
      new Route(3, 'R003', 'Tuyến 3', 'Trạm E', 'Trạm F', new Time(11, 0), new Time(12, 0), 40, 20, 60, 'active', new Date(), new Date()),
      new Route(4, 'R004', 'Tuyến 4', 'Trạm G', 'Trạm H', new Time(13, 0), new Time(14, 0), 15, 5, 20, 'active', new Date(), new Date()),
      new Route(5, 'R005', 'Tuyến 5', 'Trạm I', 'Trạm J', new Time(15, 0), new Time(16, 0), 50, 25, 75, 'inactive', new Date(), new Date()),
      new Route(6, 'R006', 'Tuyến 6', 'Trạm K', 'Trạm L', new Time(17, 0), new Time(18, 0), 35, 15, 50, 'active', new Date(), new Date()),
      new Route(7, 'R007', 'Tuyến 7', 'Trạm M', 'Trạm N', new Time(19, 0), new Time(20, 0), 20, 10, 30, 'inactive', new Date(), new Date()),
      new Route(8, 'R008', 'Tuyến 8', 'Trạm O', 'Trạm P', new Time(21, 0), new Time(22, 0), 45, 20, 65, 'active', new Date(), new Date()),
    ]);
  }, []);
  
  const handleViewDetail = (route) => {
    setShowDetail({key:true,value: route});
    console.log('Viewing details for route:', route);
  }
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
        <div className={StyleMain.row_direction} style={{justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className={StyleMain.setTitle_h1}><i className="fas fa-route" /> Quản Lý Tuyến Xe</h1>
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
              <th><i className="fas fa-hashtag" /> MÃ SỐ TUYẾN</th>
              <th><i className="fas fa-signature" /> TÊN TUYẾN</th>
              <th><i className="fas fa-map-marker-alt" /> TRẠM BẮT ĐẦU</th>
              <th><i className="fas fa-route" /> TỔNG ĐƯỜNG ĐI</th>
              <th><i class="fa-solid fa-person"></i> SỐ HỌC SINH</th>
              <th><i className="fas fa-clock" /> THỜI GIAN</th>
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
            onClose={() => setShowDetail(false)}
            />)}
      </div>
    </div>
    
  );
}

export default RouteManagementPage;