import React, { useState } from "react";
import "../Assets/CSS/profile.css";

// Import local images
import imgAvatar from "../Assets/images/imgAvatar.png";
import imgGroup104 from "../Assets/images/imgGroup104.svg";
import imgStar1 from "../Assets/images/imgStar1.svg";
import imgCamera from "../Assets/images/camera.svg";

export default function Profile({ onBackToMain }) {
  const [profileData, setProfileData] = useState({
    driverId: "BUSDR-023",
    licenseType: "Bằng B1",
    name: "",
    phone: "",
    gender: "",
    email: "",
    birthDate: "",
    idCard: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleUpdate = () => {
    console.log("Profile updated:", profileData);
    setIsEditing(false);
    // Handle update logic here
  };

  return (
    <div className="profile-root">
      {/* Header with back button */}
      <div className="profile-header">
        <button className="profile-back-btn" onClick={() => onBackToMain && onBackToMain()}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="profile-back-icon">
            <path d="M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3L201.3 297.3z"/>
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="profile-container">
        {/* Avatar Section */}
        <div className="profile-avatar-section">
        <div className="profile-avatar-wrapper">
          <img src={imgAvatar} alt="avatar" className="profile-avatar" />
          <div className="profile-avatar-badge">
            <img src={imgCamera} alt="camera" className="profile-badge-icon" />
          </div>
        </div>          {/* Rating */}
          <div className="profile-rating">
            <img src={imgStar1} alt="star" className="profile-star-icon" />
            <span className="profile-rating-text">5.00</span>
          </div>
        </div>

        {/* Form Section */}
        <div className="profile-form">
          {/* Driver ID and License Row */}
          <div className="profile-form-row">
            <div className="profile-form-group profile-form-group-half">
              <label className="profile-form-label">Mã lái xe</label>
              <input
                type="text"
                name="driverId"
                value={profileData.driverId}
                disabled
                className="profile-form-input profile-form-input-disabled"
              />
            </div>
            <div className="profile-form-group profile-form-group-half">
              <label className="profile-form-label">Bằng lái</label>
              <input
                type="text"
                name="licenseType"
                value={profileData.licenseType}
                disabled
                className="profile-form-input profile-form-input-disabled"
              />
            </div>
          </div>

          {/* Name */}
          <div className="profile-form-group">
            <label className="profile-form-label">Tên</label>
            <input
              type="text"
              name="name"
              placeholder="Nhập tên của bạn"
              value={profileData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="profile-form-input"
            />
          </div>

          {/* Phone and Gender Row */}
          <div className="profile-form-row">
            <div className="profile-form-group profile-form-group-half">
              <label className="profile-form-label">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-form-input"
              />
            </div>
            <div className="profile-form-group profile-form-group-half">
              <label className="profile-form-label">Giới tính</label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="profile-form-select"
              >
                <option value="">Vui lòng chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="profile-form-group">
            <label className="profile-form-label">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              value={profileData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="profile-form-input"
            />
          </div>

          {/* Birth Date */}
          <div className="profile-form-group">
            <label className="profile-form-label">Ngày sinh</label>
            <input
              type="date"
              name="birthDate"
              value={profileData.birthDate}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="profile-form-input"
            />
          </div>

          {/* ID Card */}
          <div className="profile-form-group">
            <label className="profile-form-label">CCCD</label>
            <input
              type="text"
              name="idCard"
              placeholder="Nhập số CCCD"
              value={profileData.idCard}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="profile-form-input"
            />
          </div>

          {/* Update Button */}
          <div className="profile-button-group">
            {!isEditing ? (
              <button
                className="profile-btn profile-btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa
              </button>
            ) : (
              <>
                <button
                  className="profile-btn profile-btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Hủy
                </button>
                <button
                  className="profile-btn profile-btn-primary"
                  onClick={handleUpdate}
                >
                  Cập nhật
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
