// File: ThongBao.js
import React, { useState, useEffect, useCallback } from "react";
import "./ThongBao.css";

const NOTIFICATION_API_URL = "http://localhost:3001/api/notifications";

export default function ThongBao() {
    // --- State Cũ (Giữ nguyên) ---
    const [activeTab, setActiveTab] = useState("all");
    const [showPopup, setShowPopup] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [filterStatus, setFilterStatus] = useState(""); 
    const [viewingNotice, setViewingNotice] = useState(null);
    
    // --- State Mới (Cho chức năng nâng cao) ---
    const [usersList, setUsersList] = useState([]); 
    const [selectAll, setSelectAll] = useState(true);

    const [newNotice, setNewNotice] = useState({
        recipient: "",      // 'driver', 'parent', 'bus'
        title: "",
        content: "",
        type: "manual",     // 'manual' (Gửi ngay) hoặc 'scheduled' (Hẹn giờ)
        scheduledTime: "",  
        isRecurring: false, 
        specificIds: []     // Danh sách ID người nhận cụ thể
    });

    // Hàm tải thông báo (Giữ nguyên logic cũ)
    const fetchNotifications = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (activeTab !== 'all') params.append('type', activeTab);
            if (filterStatus) params.append('status', filterStatus);
            const res = await fetch(`${NOTIFICATION_API_URL}?${params.toString()}`);
            const data = await res.json();
            setNotifications(data);
        } catch (e) { console.error(e); }
    }, [activeTab, filterStatus]);

    useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

    // --- Logic Mới: Tự động tải danh sách user khi chọn nhóm ---
    useEffect(() => {
        if ((newNotice.recipient === 'driver' || newNotice.recipient === 'parent') && showPopup) {
            // Gọi API lấy danh sách tên
            fetch(`${NOTIFICATION_API_URL}/users/${newNotice.recipient}`)
                .then(res => res.json())
                .then(data => {
                    setUsersList(data);
                    setSelectAll(true); // Mặc định chọn tất cả
                    setNewNotice(prev => ({ ...prev, specificIds: [] }));
                })
                .catch(err => console.error(err));
        } else {
            setUsersList([]); // Xóa list nếu không phải driver/parent
        }
    }, [newNotice.recipient, showPopup]);

    // Hàm xử lý form
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewNotice(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    // Logic chọn từng người
    const handleUserCheck = (id) => {
        setSelectAll(false);
        setNewNotice(prev => {
            const currentIds = prev.specificIds;
            // Nếu đang Select All mà bỏ tick 1 người -> Add tất cả những người còn lại vào specificIds
            if (selectAll) {
                const allIds = usersList.map(u => u.id);
                return { ...prev, specificIds: allIds.filter(uid => uid !== id) };
            }
            // Logic toggle bình thường
            if (currentIds.includes(id)) return { ...prev, specificIds: currentIds.filter(x => x !== id) };
            else return { ...prev, specificIds: [...currentIds, id] };
        });
    };

    // Logic nút "Chọn tất cả"
    const handleSelectAll = (e) => {
        setSelectAll(e.target.checked);
        setNewNotice(prev => ({ ...prev, specificIds: [] })); // Rỗng = Backend tự hiểu là All
    };

    // Hàm gửi
    const handleSend = async () => {
        if (!newNotice.recipient || !newNotice.title || !newNotice.content) return alert("Thiếu thông tin!");
        if (newNotice.type === 'scheduled' && !newNotice.scheduledTime) return alert("Chưa chọn giờ gửi!");
        
        // Nếu không chọn tất cả và danh sách chọn rỗng -> Lỗi
        if (!selectAll && newNotice.specificIds.length === 0 && usersList.length > 0) return alert("Chọn ít nhất 1 người!");

        try {
            // Payload gửi lên server
            const payload = { 
                ...newNotice, 
                // Nếu selectAll = true -> gửi mảng rỗng (Backend hiểu là gửi hết)
                specificIds: selectAll ? [] : newNotice.specificIds 
            };

            const res = await fetch(NOTIFICATION_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Lỗi gửi");
            
            const data = await res.json();
            alert(data.message);
            handleCancel();
            fetchNotifications();
        } catch (e) { alert(e.message); }
    };

    const handleCancel = () => {
        setShowPopup(false);
        setNewNotice({ recipient: "", title: "", content: "", type: "manual", scheduledTime: "", isRecurring: false, specificIds: [] });
    };

    const handleViewNotice = async (notice) => {
        setViewingNotice(notice);
        if (notice.status === 'unread') {
            await fetch(`${NOTIFICATION_API_URL}/${notice.id}/read`, { method: 'PATCH' });
            setNotifications(curr => curr.map(n => n.id === notice.id ? { ...n, status: 'read' } : n));
        }
    };

    return (
        <div className="dashboard">
            <aside className="sidebar"><h2>DASHBOARD</h2></aside>
            <main className="content">
                <header className="header"><h1>THÔNG BÁO</h1><div className="profile">👤 Profile ▼</div></header>

                <div className="thongbao-container">
                    <div className="main">
                        {/* Phần Sidebar nút Tạo & Filter giữ nguyên */}
                        <div className="sidebar">
                            <button className="btn-create" onClick={() => setShowPopup(true)}>+ Tạo thông báo</button>
                            <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="">Chọn lọc (Tất cả)</option>
                                <option value="unread">Chưa xem</option>
                                <option value="read">Đã xem</option>
                            </select>
                        </div>

                        {/* Phần List giữ nguyên */}
                        <div className="content">
                            <div className="tabs">
                                <button onClick={() => setActiveTab("all")} className={`tab ${activeTab === "all" ? "active" : ""}`}>Tất cả</button>
                                <button onClick={() => setActiveTab("bus")} className={`tab ${activeTab === "bus" ? "active" : ""}`}>Xe buýt</button>
                                <button onClick={() => setActiveTab("driver")} className={`tab ${activeTab === "driver" ? "active" : ""}`}>Tài xế</button>
                                <button onClick={() => setActiveTab("parent")} className={`tab ${activeTab === "parent" ? "active" : ""}`}>Phụ huynh</button>
                            </div>
                            
                            <div className="content-box">
                                {notifications.length > 0 ? (
                                    <ul className="notification-list">
                                        {notifications.map(notif => (
                                            <li key={notif.id} className="notification-item" onClick={() => handleViewNotice(notif)} style={{ cursor: 'pointer', opacity: notif.status === 'read' ? 0.6 : 1 }}>
                                                <div className="notification-icon">🔔</div>
                                                <div className="notification-body">
                                                    <strong className="notification-title">{notif.title}</strong>
                                                    <p className="notification-content">{notif.content}</p>
                                                    {/* Badge Hẹn giờ */}
                                                    {notif.type === 'scheduled' && <span className="schedule-tag">⏳ Hẹn giờ: {new Date(notif.scheduled_time).toLocaleString('vi-VN')}</span>}
                                                </div>
                                                <small className="notification-time">{new Date(notif.created_at).toLocaleString('vi-VN')}</small>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="no-notifications">Không có thông báo nào</p>}
                            </div>
                        </div>
                    </div>

                    {/* === POPUP TẠO MỚI (ĐƯỢC NÂNG CẤP) === */}
                    {showPopup && (
                        <div className="popup-overlay">
                           <div className="popup large-popup">
                                <h2>Tạo thông báo mới</h2>

                                {/* 1. Loại tin: Gửi ngay / Hẹn giờ */}
                                <div className="radio-group">
                                    <label><input type="radio" name="type" value="manual" checked={newNotice.type === 'manual'} onChange={handleChange}/> Gửi ngay</label>
                                    <label><input type="radio" name="type" value="scheduled" checked={newNotice.type === 'scheduled'} onChange={handleChange}/> Tự động / Hẹn giờ</label>
                                </div>

                                {/* 2. Khu vực Hẹn giờ (chỉ hiện khi chọn type=scheduled) */}
                                {newNotice.type === 'scheduled' && (
                                    <div className="schedule-box">
                                        <label>Thời gian gửi: <input type="datetime-local" name="scheduledTime" value={newNotice.scheduledTime} onChange={handleChange} /></label>
                                        <label className="checkbox-inline"><input type="checkbox" name="isRecurring" checked={newNotice.isRecurring} onChange={handleChange} /> Lặp lại hàng ngày</label>
                                    </div>
                                )}

                                {/* 3. Chọn nhóm nhận */}
                                <label>Gửi đến:
                                    <select name="recipient" value={newNotice.recipient} onChange={handleChange}>
                                        <option value="">-- Chọn nhóm --</option>
                                        <option value="driver">Tài xế</option>
                                        <option value="parent">Phụ huynh</option>
                                        <option value="bus">Hệ thống (Admin)</option>
                                    </select>
                                </label>

                                {/* 4. Danh sách chọn người (Chỉ hiện khi có usersList) */}
                                {usersList.length > 0 && (
                                    <div className="user-selection-box">
                                        <label className="user-row select-all">
                                            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} /> 
                                            <strong>Gửi tất cả ({usersList.length})</strong>
                                        </label>
                                        <div className="user-list-scroll">
                                            {usersList.map(u => (
                                                <label key={u.id} className="user-row">
                                                    <input type="checkbox" 
                                                        checked={selectAll ? true : newNotice.specificIds.includes(u.id)} 
                                                        disabled={selectAll}
                                                        onChange={() => handleUserCheck(u.id)} 
                                                    /> 
                                                    {u.name}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <label>Tiêu đề: <input type="text" name="title" value={newNotice.title} onChange={handleChange} /></label>
                                <label>Nội dung: <textarea name="content" value={newNotice.content} onChange={handleChange} rows={4} /></label>

                                <div className="popup-buttons">
                                    <button className="btn-send" onClick={handleSend}>{newNotice.type === 'scheduled' ? 'Lên lịch' : 'Gửi'}</button>
                                    <button className="btn-cancel" onClick={handleCancel}>Hủy</button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Popup Xem chi tiết (Giữ nguyên) */}
                    {viewingNotice && (
                        <div className="popup-overlay" onClick={() => setViewingNotice(null)}>
                            <div className="popup" onClick={(e) => e.stopPropagation()}>
                                <h2 style={{color:'#2563eb'}}>{viewingNotice.title}</h2>
                                <p>{viewingNotice.content}</p>
                                <div className="popup-buttons"><button className="btn-cancel" onClick={() => setViewingNotice(null)}>Đóng</button></div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}