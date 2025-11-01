import React, { useState } from "react";
import "./ThongBao.css";

export default function ThongBao() {
    const [activeTab, setActiveTab] = useState("all");
    const [showPopup, setShowPopup] = useState(false);

    const [newNotice, setNewNotice] = useState({
        recipient: "",
        title: "",
        content: "",
    });

    // Mảng lưu các file đã chọn
    const [files, setFiles] = useState([]);
    // Mảng để render input file hiện tại
    const [fileInputs, setFileInputs] = useState([0]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewNotice(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        setFiles(prev => [...prev, file]);

        // Nếu là input cuối cùng, thêm input mới phía dưới
        if (index === fileInputs.length - 1) {
            setFileInputs(prev => [...prev, prev.length]);
        }
    };

    const handleSend = () => {
        console.log("Gửi thông báo:", newNotice);
        if (files.length > 0) {
            console.log("Các tệp đính kèm:", files.map(f => f.name));
        }
        setShowPopup(false);
        setNewNotice({ recipient: "", title: "", content: "" });
        setFiles([]);
        setFileInputs([0]);
        alert("Thông báo đã được gửi!");
    };

    const handleCancel = () => {
        setShowPopup(false);
        setNewNotice({ recipient: "", title: "", content: "" });
        setFiles([]);
        setFileInputs([0]);
    };

    const removeFile = (index) => {
        setFiles(prev => {
            const newFiles = [...prev];
            newFiles.splice(index, 1);
            return newFiles;
        });

        setFileInputs(prev => {
            const newInputs = [...prev];
            if (newInputs.length > 1) {
                newInputs.splice(index, 1);
            } else {
                newInputs[0] = 0;
            }
            return newInputs;
        });
    };

    return (
        <div className="dashboard">
            {/* Sidebar giống QuanLyXeBuyt */}
            <aside className="sidebar">
                <h2>DASHBOARD</h2>
            </aside>

            {/* Nội dung chính */}
            <main className="content">
                {/* Header xanh */}
                <header className="header">
                    <h1>THÔNG BÁO</h1>
                    <div className="profile">👤 Profile ▼</div>
                </header>

                {/* Phần code cũ của bạn */}
                <div className="thongbao-container">
                    <div className="main">
                        {/* Sidebar nhỏ bên trong */}
                        <div className="sidebar">
                            <button
                                className="btn-create"
                                onClick={() => setShowPopup(true)}
                            >
                                + Tạo thông báo
                            </button>
                            <select className="filter-select">
                                <option>Chọn lọc</option>
                                <option>Chưa xem</option>
                                <option>Đã xem</option>
                                <option>Đã gửi</option>
                            </select>
                        </div>

                        {/* Content */}
                        <div className="content">
                            <div className="tabs">
                                <button onClick={() => setActiveTab("all")} className={`tab ${activeTab === "all" ? "active" : ""}`}>Tất cả</button>
                                <button onClick={() => setActiveTab("bus")} className={`tab ${activeTab === "bus" ? "active" : ""}`}>Xe buýt</button>
                                <button onClick={() => setActiveTab("driver")} className={`tab ${activeTab === "driver" ? "active" : ""}`}>Tài xế</button>
                                <button onClick={() => setActiveTab("parent")} className={`tab ${activeTab === "parent" ? "active" : ""}`}>Phụ huynh</button>
                            </div>
                            <div className="content-box">Nội dung {activeTab}</div>
                        </div>
                    </div>

                    {/* Popup tạo thông báo */}
                    {showPopup && (
                        <div className="popup-overlay">
                            <div className="popup large-popup">
                                <h2>Tạo thông báo mới</h2>
                                <label>
                                    Gửi đến:
                                    <select
                                        name="recipient"
                                        value={newNotice.recipient}
                                        onChange={handleChange}
                                    >
                                        <option value="">Chọn</option>
                                        <option value="driver">Tài xế</option>
                                        <option value="system">Hệ thống</option>
                                        <option value="parent">Phụ huynh</option>
                                    </select>
                                </label>
                                <label>
                                    Tiêu đề:
                                    <input
                                        type="text"
                                        name="title"
                                        value={newNotice.title}
                                        onChange={handleChange}
                                    />
                                </label>
                                <label>
                                    Nội dung:
                                    <textarea
                                        name="content"
                                        value={newNotice.content}
                                        onChange={handleChange}
                                        rows={8}
                                    />
                                </label>

                                <label>Thêm tệp:</label>
                                {fileInputs.map((key, index) => {
                                    const file = files[index];
                                    return (
                                        <div key={key} className="file-input-wrapper">
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, index)}
                                            />
                                            {file && (
                                                <button
                                                    type="button"
                                                    className="remove-file-btn"
                                                    onClick={() => removeFile(index)}
                                                >
                                                    ✖
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}

                                <div className="popup-buttons">
                                    <button className="btn-send" onClick={handleSend}>Gửi</button>
                                    <button className="btn-cancel" onClick={handleCancel}>Hủy</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
