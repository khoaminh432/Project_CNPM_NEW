import React, { useEffect, useState, useMemo } from 'react';
import './style.css';
import StyleMain from './../styleMain.module.css';

// Import các component
import BusRoute from './component/bus_route';
import AddRoute from './component/AddRoute';
import { RouteDetail } from './component/formdetails/Detail_Route';

// Import dữ liệu mẫu (nếu chưa có API thật)
import { defaultRoutes } from "../../../models/Route";

// Các hàm hỗ trợ
const formatNumber2 = (value) => {
  if (value === null || value === undefined || value === '') return '0.00';
  const n = Number(value);
  return Number.isNaN(n) ? '0.00' : n.toFixed(2);
};

const parseKm = (val) => {
  if (val == null) return 0;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const match = val.match(/[\d,.]+/);
    if (!match) return 0;
    return Number(match[0].replace(',', '.'));
  }
  return 0;
};

const parseTimeToModel = (inputTime, fallback = "00:00") => {
  if (typeof inputTime === 'string') {
    const parts = inputTime.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
  } else if (inputTime instanceof Date) {
    return `${inputTime.getHours().toString().padStart(2, '0')}:${inputTime.getMinutes().toString().padStart(2, '0')}`;
  }
  return fallback;
};

const totalRouteStable = (array) => array.filter(route => route.status === "active").length;
const totalDistance = (array) => formatNumber2(array.reduce((sum, route) => sum + parseKm(route.distance_km), 0));

const renderRoutesTable = (routes, handleViewDetail) => {
  return routes.map((route) => (
    <BusRoute key={route.route_id || route.route_code} route={route} onViewDetail={handleViewDetail} />
  ));
};

function RouteManagementPage() {
  const [routes, setRoutes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showDetail, setShowDetail] = useState({ key: false, value: null });
  const [showAddRoute, setShowAddRoute] = useState(false);

  // Load dữ liệu khi component mount
  useEffect(() => {
    setRoutes(defaultRoutes);
    // Nếu sau này có API thật thì thay bằng:
    // fetchRoutes().then(data => setRoutes(data));
  }, []);

  // Cập nhật hoặc thêm tuyến xe
  const editRoute = (updated) => {
    setRoutes(prev => prev.map(r => {
      const match = (updated.route_id && r.route_id === updated.route_id) ||
                    (updated.route_code && r.route_code === updated.route_code);
      if (match) {
        return {
          ...r,
          ...updated,
          planned_start: updated.planned_start ? parseTimeToModel(updated.planned_start) : r.planned_start,
          planned_end: updated.planned_end ? parseTimeToModel(updated.planned_end) : r.planned_end,
          total_students: Number(updated.total_students ?? r.total_students),
          estimated_duration_minutes: Number(updated.estimated_duration_minutes ?? r.estimated_duration_minutes),
          updated_at: new Date()
        };
      }
      return r;
    }));
  };

  const handleSaveRoute = (newRoute) => {
    editRoute(newRoute);
    setShowDetail({ key: false, value: null });
  };

  const handleViewDetail = (route) => {
    setShowDetail({ key: true, value: route });
  };

  const cancelShowAddRoute = () => {
    setShowAddRoute(false);
  };

  // Lọc tuyến theo trạng thái
  const filteredRoutes = useMemo(() => {
    if (filter === 'all') return routes;
    return routes.filter(r => String(r.status).toLowerCase() === filter.toLowerCase());
  }, [routes, filter]);

  // Tổng hợp số liệu
  const totalDistanceAll = totalDistance(routes);
  const totalDistanceVisible = totalDistance(filteredRoutes);
  const totalActiveRoutes = totalRouteStable(routes);

  return (
    <div className="container-route-management">
      {!showAddRoute ? (
        <>
          <header>
            <div className={StyleMain.row_direction} style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h1 className={StyleMain.setTitle_h1}>
                  <i className="fas fa-route" /> Quản Lý Tuyến Xe
                </h1>
                <p className="description">Quản lý và theo dõi các tuyến xe hiện có một cách hiệu quả và trực quan</p>
              </div>
              <div>
                <button
                  style={{ color: "white", padding: "10px 20px", fontSize: "1em", cursor: "pointer" }}
                  onClick={() => setShowAddRoute(true)}
                >
                  Thêm Tuyến xe
                </button>
              </div>
            </div>
          </header>

          <div className={`dashboard ${StyleMain.row_direction}`}>
            <div className="card">
              <i className="fas fa-bus" />
              <h3>Tổng số tuyến xe</h3>
              <div className="number">{routes.length}</div>
            </div>
            <div className="card">
              <i className="fas fa-check-circle" />
              <h3>Tuyến đang hoạt động</h3>
              <div className="number">{totalActiveRoutes}</div>
            </div>
            <div className="card">
              <i className="fas fa-exclamation-triangle" />
              <h3>Tuyến cần chú ý</h3>
              <div className="number">{routes.length - totalActiveRoutes}</div>
            </div>
            <div className="card">
              <i className="fas fa-road" />
              <h3>Tổng quãng đường</h3>
              <div className="number">{totalDistanceAll} km</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Hiển thị: {totalDistanceVisible} km</div>
            </div>
          </div>

          <div className="controls">
            <div className="search-container">
              <i className="fas fa-search" />
              <input
                type="text"
                className="search-box"
                placeholder="Tìm kiếm tuyến xe..."
                style={{ fontSize: "1.1em" }}
              />
            </div>
            <div className="filter-container">
              <i className="fas fa-filter" />
              <select
                className="filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
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
                  <th><i className="fa-solid fa-person" /> SỐ HỌC SINH</th>
                  <th><i className="fas fa-clock" /> THỜI GIAN</th>
                  <th><i className="fas fa-traffic-light" /> TÌNH TRẠNG</th>
                  <th><i className="fas fa-info-circle" /> CHI TIẾT</th>
                </tr>
              </thead>
              <tbody id="routes-body">
                {renderRoutesTable(filteredRoutes, handleViewDetail)}
              </tbody>
            </table>

            {showDetail.key && showDetail.value && (
              <RouteDetail
                route={showDetail.value}
                onClose={() => setShowDetail({ key: false, value: null })}
                onSave={handleSaveRoute}
              />
            )}
          </div>
        </>
      ) : (
        <AddRoute onclose={cancelShowAddRoute} />
      )}
    </div>
  );
}

export default RouteManagementPage;