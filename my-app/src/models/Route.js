import React, { useState } from "react";
export class Route{
    constructor(route_id, route_code, route_name, start_location, end_location, planned_start, planned_end, 
        total_students = 0, distance_km, estimated_duration_minutes, status = 'active', created_at, updated_at) {
        this.route_id = route_id;
        this.route_code = route_code;
        this.route_name = route_name;
        this.start_location = start_location;
        this.end_location = end_location;
        this.planned_start = planned_start;
        this.planned_end = planned_end;
        this.total_students = total_students;
        this.distance_km = distance_km;
        this.estimated_duration_minutes = estimated_duration_minutes;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
            
toTableRow(handledetailroute=()=>{}) {
    const statusIcon = this.getStatusIcon();
    const statusText = this.getStatusText();
    const statusClass = this.status==="active" ? `status status-${"stable"}`: `status status-${"danger"}`;
  return (
    <tr>
        <td><strong>{this.route_code}</strong>
            </td>
        <td>
            <div>{this.route_name}</div>
        </td>
        <td>{this.start_location}</td>
        <td>{this.distance_km}km </td>
        <td>{this.total_students}</td>
        <td>Từ {this.planned_start.toString()} Đến {this.planned_end.toString()}</td>
        <td><span class={statusClass}>{statusIcon} {statusText}</span></td>
        <td><button class="btn-detail" data-id={this.route_code} onClick={()=>handledetailroute(this)} ><i class="fas fa-eye"></i> Xem chi tiết</button></td>
    </tr>
  );
            } 
    // Phương thức lấy icon trạng thái
            getStatusIcon() {
                const iconMap = {
                    'stable': <i class="fas fa-check-circle"></i>,
                    'warning': <i class="fas fa-exclamation-triangle"></i>,
                    'danger': <i class="fas fa-times-circle"></i>,
                    'active': <i class="fas fa-check-circle"></i>,
                    'inactive': <i class="fas fa-times-circle"></i>
                };
                return iconMap[this.status] || <i class="fas fa-question-circle"></i>;
            }
    // Phương thức lấy văn bản trạng thái
            getStatusText() {
                const statusMap = {
                    'stable': 'Ổn định',
                    'warning': 'Có vấn đề',
                    'danger': 'Nguy hiểm',
                    "active": 'Hoạt động',
                    "inactive": 'Không hoạt động'
                };
                return statusMap[this.status] || 'Không xác định';
            }
    addthis(){


        return (
            <div class="container">
        <div class="main-content">
            <div class="section">
                <h2 class="section-title">Chọn tuyến đường</h2>
                <div class="form-group">
                    <label for="start-address">Nhập địa chỉ bắt đầu</label>
                    <input type="text" id="start-address" placeholder="Nhập địa chỉ bắt đầu"/>
                </div>
                <div class="form-group">
                    <label for="end-address">Nhập địa chỉ kết thúc</label>
                    <input type="text" id="end-address" placeholder="Nhập địa chỉ kết thúc"/>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">Tạo Tuyến Tuyến Xe Mới</h2>
                
                <div class="form-group">
                    <label for="this-name">Tên tuyến xe</label>
                    <input type="text" id="this-name" placeholder="Nhập tên tuyến xe"/>
                </div>
                
                <div class="form-group">
                    <label>Các Trạm đi qua</label>
                    <div class="stations-list" id="stations-list">
                        <div class="station-item">
                            <span class="station-name">Bến Thành</span>
                            <button class="remove-station">❌</button>
                        </div>
                        <div class="station-item">
                            <span class="station-name">Ba Sơn</span>
                            <button class="remove-station">❌</button>
                        </div>
                        <div class="station-item">
                            <span class="station-name">Nha Hải Thanh Phó</span>
                            <button class="remove-station">❌</button>
                        </div>
                        <div class="station-item">
                            <span class="station-name">Đệnh Viện Quản Y</span>
                            <button class="remove-station">❌</button>
                        </div>
                        <div class="station-item">
                            <span class="station-name">Công Viện Tao Đàn</span>
                            <button class="remove-station">❌</button>
                        </div>
                        <div class="station-item">
                            <span class="station-name">Suối Tiền</span>
                            <button class="remove-station">❌</button>
                        </div>
                    </div>
                    
                    <button class="add-station-btn" id="add-station-btn">
                        <span>+</span> Thêm Trạm
                    </button>
                </div>
                
                <hr/>
                
                <div class="form-group">
                    <label>Thời gian:</label>
                    <div class="time-inputs">
                        <div class="form-group">
                            <label for="start-time">Bắt Đầu</label>
                            <input type="text" id="start-time" placeholder="HH:MM"/>
                        </div>
                        <div class="form-group">
                            <label for="end-time">Kết thúc</label>
                            <input type="text" id="end-time" placeholder="HH:MM"/>
                        </div>
                    </div>
                </div>
                
                <hr/>
                
                <div class="form-group">
                    <label>Tuyến Xe:</label>
                    <div class="this-summary">
                        Bến Thành --- Suối Tiên
                    </div>
                </div>
                
                <button class="save-btn">Lưu Tuyến Xe</button>
            </div>
        </div>
    </div>
        );
    }
    setupStations(stations){
        this.stations = stations;
    }
    setHasVehicle(hasVehicle){
        this.hasVehicle = hasVehicle;
    }
    setStatus(status){
        this.status = status;
    }
    setTimeStart(timeStart){
        this.timeStart = timeStart;
    }
    setTimeEnd(timeEnd){
        this.timeEnd = timeEnd;
    }
    setTotalDistance(totalDistance){
        this.totalDistance = totalDistance;
    }
    setStartStation(startStation){
        this.startStation = startStation;
    }
    setName(name){
        this.name = name;
    }
}

