import React, { useState } from "react";
import "./NextWeekScheduler.css"; // File CSS mới chúng ta sẽ tạo

// --- Dữ liệu giả lập cho giao diện ---
const DUMMY_VEHICLES = [
    { id: "XE01", route: "Tuyến 50 - Trường THCS Trường Chinh" },
    { id: "XE02", route: "Tuyến 18 - Trường THPT Nguyễn iThị Minh Kha" },
    { id: "XE03", route: "Tuyến 06 - Trường THPT Võ Thị Sáu" },
];

const DUMMY_DAYS = [
    "Thứ 2 (03/11)",
    "Thứ 3 (04/11)",
    "Thứ 4 (05/11)",
    "Thứ 5 (06/11)",
    "Thứ 6 (07/11)",
    "Thứ 7 (08/11)",
    "Chủ Nhật (09/11)",
];

const DUMMY_SCHEDULE_RESULT = {
    "Thứ 2 (03/11)": [
        { busId: "001", plate: "51C-49494", route: "Tuyến 50", driverName: "Nguyễn Văn A", driverId: "TX001", startTime: "05:30", endTime: "11:00" },
        { busId: "002", plate: "51B-12345", route: "Tuyến 18", driverName: "Lê Thị B", driverId: "TX002", startTime: "06:00", endTime: "12:00" },
        { busId: "003", plate: "51D-67890", route: "Tuyến 06", driverName: "Phạm Văn C", driverId: "TX049", startTime: "05:45", endTime: "11:30" },
        { busId: "004", plate: "51A-11111", route: "Tuyến 10", driverName: null, driverId: null, startTime: "--:--", endTime: "--:--" },
    ],
    "Thứ 3 (04/11)": [
        { busId: "001", plate: "51C-49494", route: "Tuyến 50", driverName: "Lê Thị B", driverId: "TX002", startTime: "05:30", endTime: "11:00" },
        { busId: "002", plate: "51B-12345", route: "Tuyến 18", driverName: "Nguyễn Văn A", driverId: "TX001", startTime: "06:00", endTime: "12:00" },
    ]
};
// ------------------------------------


export default function NextWeekScheduler({ isOpen, onClose }) {

    const [mainTab, setMainTab] = useState('currentWeek'); // 'currentWeek' hoặc 'nextWeek'
    const [subTab, setSubTab] = useState('detailed-matrix');

    const [filterRoute, setFilterRoute] = useState("Tất cả");
    const [filterStatus, setFilterStatus] = useState("Tất cả");
    const [summaryDay, setSummaryDay] = useState(DUMMY_DAYS[0]);

    if (!isOpen) {
        return null;
    }

    const filteredVehicles = DUMMY_VEHICLES.filter(vehicle => {
        if (filterRoute === "Tất cả") return true;
        return vehicle.route.includes(filterRoute);
    });

    const handleFullWeekMatch = () => {
        alert(`Đã tự động gán lịch cho toàn tuần.\nVui lòng kiểm tra "Tab 2 (Chi tiết)" và "Tab 3 (Tổng quan)".`);

        setSubTab("bus-summary"); 
    }

    // Hàm xử lý khi chuyển Tab CHÍNH
    const selectMainTab = (tab) => {
        setMainTab(tab);
        if (tab === 'currentWeek') {
            setSubTab('detailed-matrix');
        } else {
            setSubTab('fast-match');
        }
    }

    // === CẬP NHẬT: Xóa tiêu đề động ===
    // const popupTitle = mainTab === 'currentWeek' 
    //   ? "Thay đổi lịch Hiện Tại" 
    //   : "Xếp lịch Tuần Tới";

    return (
        <div className="popup-overlay">
            <div className="popup scheduler-popup">
                <div className="popup-header">
                    {/* === CẬP NHẬT: Tiêu đề tĩnh === */}
                    <h2>Gán tài xế</h2>
                    <button className="close-btn" onClick={onClose}>✖</button>
                </div>

                {/* === CẤP 1: TAB CHÍNH (Hiện Tại / Tuần Tới) === */}
                <div className="scheduler-tabs-main">
                    <button
                        className={`main-tab ${mainTab === 'currentWeek' ? 'active' : ''}`}
                        onClick={() => selectMainTab('currentWeek')}
                    >
                        Thay đổi lịch Hiện Tại
                    </button>
                    <button
                        className={`main-tab ${mainTab === 'nextWeek' ? 'active' : ''}`}
                        onClick={() => selectMainTab('nextWeek')}
                    >
                        Xếp lịch Tuần Tới
                    </button>
                </div>

                {/* === CẤP 2: TAB CON (Phụ thuộc vào Tab Chính) === */}
                <div className="scheduler-tabs-sub">
                    {/* Tab con cho "Lịch Hiện Tại" */}
                    {mainTab === 'currentWeek' && (
                        <>
                            <button
                                className={`scheduler-tab ${subTab === 'detailed-matrix' ? 'active' : ''}`}
                                onClick={() => setSubTab('detailed-matrix')}
                            >
                                Xếp lịch chi tiết 
                            </button>
                            <button
                                className={`scheduler-tab ${subTab === 'bus-summary' ? 'active' : ''}`}
                                onClick={() => setSubTab('bus-summary')}
                            >
                                Tổng quan 
                            </button>
                        </>
                    )}

                    {/* Tab con cho "Tuần Tới" */}
                    {mainTab === 'nextWeek' && (
                        <>
                            <button
                                className={`scheduler-tab ${subTab === 'fast-match' ? 'active' : ''}`}
                                onClick={() => setSubTab('fast-match')}
                            >
                                1. Xếp lịch nhanh
                            </button>
                            <button
                                className={`scheduler-tab ${subTab === 'detailed-matrix' ? 'active' : ''}`}
                                onClick={() => setSubTab('detailed-matrix')}
                            >
                                2. Xếp lịch chi tiết 
                            </button>
                            <button
                                className={`scheduler-tab ${subTab === 'bus-summary' ? 'active' : ''}`}
                                onClick={() => setSubTab('bus-summary')}
                            >
                                3. Tổng quan 
                            </button>
                        </>
                    )}
                </div>

                {/* === KHU VỰC NỘI DUNG (Render dựa trên cả 2 tab) === */}

                {/* NỘI DUNG CHO TAB "XẾP LỊCH NHANH" (Chỉ của Tuần Tới) */}
                {mainTab === 'nextWeek' && subTab === 'fast-match' && (
                    <div className="tab-content">
                        <div className="fast-match-container">
                            <h3>Tự động xếp lịch cho Toàn Tuần</h3>
                            <p>Hệ thống sẽ tự động gán tài xế (đã đăng ký) cho xe (chưa có lịch) dựa trên số ngày đăng ký của tài xế để đảm bảo công bằng.</p>
                            <div className="fast-match-stats">
                                <div><span>Tổng số ca cần gán (300 xe x 7 ngày):</span><strong>2100</strong></div>
                                <div><span>Tổng số ca tài xế đã đăng ký:</span><strong>2050</strong></div>
                                <div className="status-warning"><span>Trạng thái:</span><strong>Cảnh báo: Thiếu 50 ca!</strong></div>
                            </div>
                            <button className="btn-save btn-fast-match" onClick={handleFullWeekMatch}>
                                Tự động gán cho Toàn Tuần
                            </button>
                        </div>
                    </div>
                )}

                {/* NỘI DUNG CHO TAB "CHI TIẾT (MA TRẬN)" (Dùng chung cho cả 2 Tab chính) */}
                {subTab === 'detailed-matrix' && (
                    <div className="tab-content full-height">
                        {/* PHẦN BỘ LỌC */}
                        <div className="scheduler-filters">
                            <div className="form-group">
                                <label htmlFor="filter-route">Lọc theo Tuyến</label>
                                <select id="filter-route" value={filterRoute} onChange={(e) => setFilterRoute(e.target.value)}>
                                    <option value="Tất cả">Tất cả Tuyến</option>
                                    <option value="Tuyến 50">Tuyến 50</option>
                                    <option value="Tuyến 18">Tuyến 18</option>
                                    <option value="Tuyến 06">Tuyến 06</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="filter-status">Trạng thái Xe</label>
                                <select id="filter-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                    <option value="Tất cả">Hiển thị Tất cả</option>
                                    <option value="Chưa xếp">Chỉ xe chưa xếp lịch</option>
                                    <option value="Đã xếp">Chỉ xe đã xếp lịch</option>
                                </select>
                            </div>
                        </div>
                        {/* PHẦN MA TRẬN XẾP LỊCH */}
                        <div className="scheduler-matrix-container">
                            <table className="scheduler-matrix-table">
                                <thead>
                                    <tr>
                                        <th className="sticky-col">Xe / Tuyến</th>
                                        {DUMMY_DAYS.map(day => (<th key={day}>{day}</th>))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredVehicles.map(vehicle => (
                                        <tr key={vehicle.id}>
                                            <td className="sticky-col">
                                                <strong>{vehicle.id}</strong>
                                                <span>{vehicle.route}</span>
                                            </td>
                                            {DUMMY_DAYS.map(day => (
                                                <td key={`${vehicle.id}-${day}`} className="cell-dropdown">
                                                    <select disabled className="scheduler-select">
                                                        <option value="">-- Chọn tài xế --</option>
                                                    </select>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* NỘI DUNG CHO TAB "TỔNG QUAN XE BUÝT" (Dùng chung cho cả 2 Tab chính) */}
                {subTab === 'bus-summary' && (
                    <div className="tab-content full-height">
                        {/* Bộ lọc ngày cho Tab 3 */}
                        <div className="bus-summary-controls">
                            <div className="form-group">
                                <label htmlFor="summary-day-select">Xem tổng quan cho ngày:</label>
                                <select id="summary-day-select" value={summaryDay} onChange={(e) => setSummaryDay(e.target.value)}>
                                    {DUMMY_DAYS.map(day => (<option key={day} value={day}>{day}</option>))}
                                </select>
                            </div>
                        </div>
                        {/* Bảng danh sách xe buýt */}
                        <div className="bus-summary-list">
                            {/* Header của bảng */}
                            <div className="bus-summary-header">
                                <div className="summary-col-bus">Xe buýt</div>
                                <div className="summary-col-route">Tuyến đường</div>
                                <div className="summary-col-driver">Tài xế phụ trách</div>
                                <div className="summary-col-time">Giờ hoạt động</div>
                            </div>
                            {/* Body (danh sách) của bảng */}
                            <div className="bus-summary-body">
                                {(DUMMY_SCHEDULE_RESULT[summaryDay] || []).map(bus => (
                                    <div key={bus.busId} className="bus-summary-row">
                                        <div className="summary-col-bus">
                                            <div className="cell-stacked"><strong>{bus.busId}</strong><span>{bus.plate}</span></div>
                                        </div>
                                        <div className="summary-col-route">{bus.route}</div>
                                        <div className="summary-col-driver">
                                            {bus.driverName ? (
                                                <div className="cell-stacked"><strong>{bus.driverName}</strong><span>{bus.driverId}</span></div>
                                            ) : (
                                                <span className="unassigned">Chưa gán</span>
                                            )}
                                        </div>
                                        <div className="summary-col-time">
                                            <div className="cell-stacked"><strong>{bus.startTime}</strong><span>{bus.endTime}</span></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* PHẦN FOOTER (chung cho cả 3 tab) */}
                <div className="popup-footer">
                    <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
                    <button type="button" className="btn-save">Lưu Lịch Tuần</button>
                </div>
            </div>
        </div>
    );
}