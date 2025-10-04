import React, { useState } from "react";
import "./QuanLyXeBuyt.css";

function QuanLyXeBuyt() {
  const [busData, setBusData] = useState([
    { id: "001", license: "51C-49494", route: "q1-q5, vvk", status: "Đang hoạt động", driver: "Lê Văn A", departure: "Đã xuất phát", registry: "2025-12-31" },
    { id: "002", license: "52B-12345", route: "q8-q7, ttx", status: "Đang bảo trì", driver: "Lê Thị B", departure: "Chưa xuất phát", registry: "2024-11-15" },
    { id: "003", license: "54C-56789", route: "q3-q10, ltk", status: "Ngưng hoạt động", driver: "Nguyễn Văn C", departure: "Chưa xuất phát", registry: "2026-01-10" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState(""); // "edit" | "add" | "view"
  const [formData, setFormData] = useState({ id: "", license: "", route: "", status: "", driver: "", departure: "", registry: "" });
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDeparture, setFilterDeparture] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAdd = () => {
    setFormType("add");
    setFormData({ id: "", license: "", route: "", status: "", driver: "", departure: "", registry: "" });
    setShowForm(true);
  };

  const handleEdit = (bus) => {
    setFormType("edit");
    setFormData(bus);
    setShowForm(true);
  };

  const handleView = (bus) => {
    setFormType("view");
    setFormData(bus);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formType === "add") {
      setBusData([...busData, formData]);
    } else if (formType === "edit") {
      setBusData(busData.map((bus) => (bus.id === formData.id ? formData : bus)));
    }
    setShowForm(false);
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa xe buýt này không?")) {
      setBusData(busData.filter((bus) => bus.id !== formData.id));
      setShowForm(false);
    }
  };

  const filteredData = busData.filter(
    (bus) =>
      (filterStatus === "" || bus.status === filterStatus) &&
      (filterDeparture === "" || bus.departure === filterDeparture)
  );

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>DASHBOARD</h2>
      </aside>

      <main className="content">
        <header className="header">
          <h1>QUẢN LÝ XE BUÝT</h1>
          <div className="profile">Profile ⬇</div>
        </header>

        <div className="toolbar">
          <input className="search-box" type="text" placeholder="🔍 Search..." />
          <div className="toolbar-buttons">
            <button onClick={() => handleEdit(busData[0])}>Chỉnh sửa</button>
            <button onClick={handleAdd}>+ Thêm xe buýt</button>
          </div>
        </div>

        <table className="bus-table">
          <thead>
            <tr>
              <th>MÃ SỐ XE</th>
              <th>TUYẾN ĐƯỜNG</th>
              <th>
                TÌNH TRẠNG XE{" "}
                <select
                  className="header-filter"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  <option value="Đang hoạt động">Đang hoạt động</option>
                  <option value="Đang bảo trì">Đang bảo trì</option>
                  <option value="Ngưng hoạt động">Ngưng hoạt động</option>
                </select>
              </th>
              <th>TÀI XẾ</th>
              <th>
                TÌNH TRẠNG XUẤT PHÁT{" "}
                <select
                  className="header-filter"
                  value={filterDeparture}
                  onChange={(e) => setFilterDeparture(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  <option value="Đã xuất phát">Đã xuất phát</option>
                  <option value="Chưa xuất phát">Chưa xuất phát</option>
                  <option value="Kết thúc chuyến đi">Kết thúc chuyến đi</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((bus) => (
              <tr key={bus.id} onClick={() => handleView(bus)} className="clickable-row">
                <td>
                  <strong>{bus.id}</strong>
                  <small>{bus.license}</small>
                </td>
                <td className="wide-column">{bus.route}</td>
                <td>
                  <span
                    className={`status-badge ${
                      bus.status === "Đang hoạt động"
                        ? "active"
                        : bus.status === "Đang bảo trì"
                        ? "maintenance"
                        : "inactive"
                    }`}
                  >
                    {bus.status}
                  </span>
                </td>
                <td className="medium-column">{bus.driver}</td>
                <td>
                  <span
                    className={`departure-badge ${
                      bus.departure === "Đã xuất phát"
                        ? "active"
                        : bus.departure === "Kết thúc chuyến đi"
                        ? "maintenance"
                        : "inactive"
                    }`}
                  >
                    {bus.departure}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {showForm && (
        <div className="popup">
          <div className="popup-content">
            <h3>
              {formType === "add"
                ? "Thêm xe buýt"
                : formType === "edit"
                ? "Chỉnh sửa xe buýt"
                : "Thông tin xe buýt"}
            </h3>

            {/* Popup chỉ hiển thị form, không còn notification */}

            <form onSubmit={handleSubmit}>
              <label>Mã số xe</label>
              <input
                type="text"
                value={formData.id}
                readOnly={formType === "view"}
                onChange={(e) => {
                  const idValue = e.target.value.trim();
                  const foundBus = busData.find((bus) => bus.id === idValue);
                  if (foundBus) {
                    setFormData(foundBus);
                    setErrorMessage("");
                  } else if (idValue !== "") {
                    setErrorMessage("Không có thông tin hợp lệ!");
                    setFormData({ id: idValue, license: "", route: "", status: "", driver: "", departure: "", registry: "" });
                  } else {
                    setErrorMessage("");
                    setFormData({ id: "", license: "", route: "", status: "", driver: "", departure: "", registry: "" });
                  }
                }}
                required
              />
              {errorMessage && <p className="error">{errorMessage}</p>}

              <label>Tuyến đường</label>
              <input
                type="text"
                value={formData.route}
                readOnly={formType === "view"}
                onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                required
              />

              <label>Tình trạng xe</label>
              <select
                value={formData.status}
                disabled={formType === "view"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="">-- Chọn --</option>
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Ngưng hoạt động">Ngưng hoạt động</option>
                <option value="Đang bảo trì">Đang bảo trì</option>
              </select>

              <label>Tài xế</label>
              <input
                type="text"
                value={formData.driver}
                readOnly={formType === "view"}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                required
              />

              <label>Tình trạng xuất phát</label>
              <select
                value={formData.departure}
                disabled={formType === "view"}
                onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                required
              >
                <option value="">-- Chọn --</option>
                <option value="Đã xuất phát">Đã xuất phát</option>
                <option value="Kết thúc chuyến đi">Kết thúc chuyến đi</option>
                <option value="Chưa xuất phát">Chưa xuất phát</option>
              </select>

              <label>Hạn đăng kiểm</label>
              <input
                type="date"
                value={formData.registry}
                readOnly={formType === "view"}
                onChange={(e) => setFormData({ ...formData, registry: e.target.value })}
                required
              />

              <div className="popup-buttons">
                {formType !== "view" && <button type="submit">Lưu</button>}
                <button type="button" onClick={() => setShowForm(false)}>Thoát</button>
                {formType !== "add" && (
                  <button type="button" className="delete-btn" onClick={handleDelete}>Xóa</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuanLyXeBuyt;
