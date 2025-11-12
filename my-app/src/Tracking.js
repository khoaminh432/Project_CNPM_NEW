import React from "react";
function Tracking() {
  return (
    <div className="tracking-container">
      {/* Main content */}
      <div className="main-content">
        {/* Body */}
        <div className="body">
          {/* Map */}
          <div className="map">
            Map API Component
          </div>

          {/* Panel tìm kiếm / bộ lọc */}
          <div className="panel">
            <div className="search-filter">
              <input
                type="text"
                placeholder="Tìm kiếm"
                className="search-input"
              />

              {/*Dropdown*/}
              <select className="filter-select">
                <option value="">Tất cả</option>
                <option value="ten">Học sinh</option>
                <option value="tai-xe">Tài xế</option>
                <option value="xe-bus">Xe buýt</option>
                <option value="tuyen">Tuyến đường</option>
              </select>
            </div>

            {/* Bộ lọc nâng cao */}
            <div className="filter">
              <h4>Bộ lọc nâng cao</h4>
              <label>Tài xế</label>
              <input type="text" />
              <label>Học sinh</label>
              <input type="text" />
              <label>Xe buýt</label>
              <input type="text" />
              <label>Tuyến đường</label>
              <input type="text" />
              <button className="search-btn">Tìm kiếm</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tracking;
