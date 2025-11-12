

export class Route{
    constructor(id, name, startStation, totalDistance, timeStart,timeEnd, status, hasVehicle = true, stations = []) {
                this.id = id;
                this.name = name;
                this.startStation = startStation;
                this.totalDistance = totalDistance;
                this.timeStart = timeStart;
                this.timeEnd = timeEnd;
                this.status = status;
                this.hasVehicle = hasVehicle;
                this.stations = stations;
            }
            
            toTableRow() {
                const statusClass = `status status-${this.status}`;
                const statusText = this.getStatusText();
                
                return `
                    <tr>
                        <td>${this.id}</td>
                        <td>
                            <div>${this.name}</div>
                            ${!this.hasVehicle ? '<div class="no-vehicle">Chưa có xe phù hợp</div>' : ''}
                        </td>
                        <td>${this.startStation}</td>
                        <td>${this.totalDistance}</td>
                        <td>Từ ${this.timeStart.toString()} Đến ${this.timeEnd.toString()}</td>
                        <td><span class="${statusClass}">${statusText}</span></td>
                        <td><button class="btn-detail" data-id="${this.id}">Xem chi tiết</button></td>
                    </tr>
                `;
            } 
    // Phương thức lấy icon trạng thái
            getStatusIcon() {
                const iconMap = {
                    'stable': <i class="fas fa-check-circle"></i>,
                    'warning': <i class="fas fa-exclamation-triangle"></i>,
                    'danger': <i class="fas fa-times-circle"></i>
                };
                return iconMap[this.status] || <i class="fas fa-question-circle"></i>;
            }
    // Phương thức lấy văn bản trạng thái
            getStatusText() {
                const statusMap = {
                    'stable': 'Ổn định',
                    'warning': 'Có vấn đề',
                    'danger': 'Nguy hiểm'
                };
                return statusMap[this.status] || 'Không xác định';
            }
    addRoute(){


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
                <h2 class="section-title">Tạo Tuyến Xe Mới</h2>
                
                <div class="form-group">
                    <label for="route-name">Tên tuyến xe</label>
                    <input type="text" id="route-name" placeholder="Nhập tên tuyến xe"/>
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
                    <div class="route-summary">
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