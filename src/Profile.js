// Profile.js - Component con chỉ hiển thị form thông tin cá nhân
import React, { useState } from 'react';

const Profile = ({ userInfo, setUserInfo, isEditing, setIsEditing }) => {
  const [students, setStudents] = useState([
    { id: 1, name: 'Nguyễn Văn A', class: '10A1', school: 'THPT ABC' },
    { id: 2, name: 'Trần Thị B', class: '11B2', school: 'THPT XYZ' }
  ]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: '', class: '', school: '' });
  const [showStudentForm, setShowStudentForm] = useState(false);

  const styles = {
    contentSection: {
      maxWidth: '800px'
    },
    sectionTitle: {
      color: '#333',
      marginBottom: '20px',
      fontSize: '24px',
      margin: 0
    },
    infoCard: {
      background: '#f8f9fa',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px',
      borderLeft: '4px solid #667eea'
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
      paddingBottom: '10px',
      borderBottom: '1px solid #e9ecef'
    },
    infoRowLast: {
      marginBottom: 0,
      paddingBottom: 0,
      borderBottom: 'none'
    },
    infoLabel: {
      color: '#495057',
      fontWeight: '600',
      minWidth: '120px',
      margin: 0
    },
    infoValue: {
      color: '#6c757d',
      margin: 0
    },
    inputField: {
      border: '1px solid #ced4da',
      borderRadius: '5px',
      padding: '8px 12px',
      fontSize: '14px',
      width: '100%',
      boxSizing: 'border-box'
    },
    selectField: {
      border: '1px solid #ced4da',
      borderRadius: '5px',
      padding: '8px 12px',
      fontSize: '14px',
      width: '100%',
      boxSizing: 'border-box',
      backgroundColor: 'white'
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px'
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    primaryButton: {
      background: '#667eea',
      color: 'white'
    },
    secondaryButton: {
      background: '#6c757d',
      color: 'white'
    },
    editButton: {
      background: '#28a745',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    dangerButton: {
      background: '#dc3545',
      color: 'white',
      padding: '6px 12px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '12px'
    },
    warningButton: {
      background: '#ffc107',
      color: '#212529',
      padding: '6px 12px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '12px',
      marginRight: '8px'
    },
    studentSection: {
      marginTop: '30px'
    },
    studentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    studentCard: {
      background: 'white',
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '10px'
    },
    studentInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    studentDetails: {
      flex: 1
    },
    studentName: {
      fontWeight: 'bold',
      color: '#333',
      margin: '0 0 5px 0'
    },
    studentClass: {
      color: '#6c757d',
      margin: '0 0 2px 0',
      fontSize: '14px'
    },
    studentSchool: {
      color: '#6c757d',
      margin: 0,
      fontSize: '14px'
    },
    studentActions: {
      display: 'flex',
      gap: '8px'
    },
    studentForm: {
      background: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    formLabel: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: '600',
      color: '#495057'
    },
    formActions: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'flex-end'
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Thông tin đã được cập nhật:', userInfo);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Hàm xử lý học sinh
  const handleAddStudent = () => {
    if (newStudent.name && newStudent.class && newStudent.school) {
      const student = {
        id: Date.now(),
        ...newStudent
      };
      setStudents([...students, student]);
      setNewStudent({ name: '', class: '', school: '' });
      setShowStudentForm(false);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setNewStudent({ name: student.name, class: student.class, school: student.school });
    setShowStudentForm(true);
  };

  const handleUpdateStudent = () => {
    if (editingStudent && newStudent.name && newStudent.class && newStudent.school) {
      setStudents(students.map(student => 
        student.id === editingStudent.id 
          ? { ...student, ...newStudent }
          : student
      ));
      setEditingStudent(null);
      setNewStudent({ name: '', class: '', school: '' });
      setShowStudentForm(false);
    }
  };

  const handleDeleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const handleCancelStudent = () => {
    setEditingStudent(null);
    setNewStudent({ name: '', class: '', school: '' });
    setShowStudentForm(false);
  };

  return (
    <div style={styles.contentSection}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={styles.sectionTitle}>Thông tin cá nhân</h2>
        {!isEditing && (
          <button 
            style={styles.editButton}
            onClick={handleEdit}
          >
            Chỉnh sửa
          </button>
        )}
      </div>
      
      <div style={styles.infoCard}>
        <div style={styles.infoRow}>
          <strong style={styles.infoLabel}>Họ và tên</strong>
          {isEditing ? (
            <input
              type="text"
              value={userInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              style={styles.inputField}
            />
          ) : (
            <p style={styles.infoValue}>{userInfo.name}</p>
          )}
        </div>
        
        <div style={styles.infoRow}>
          <strong style={styles.infoLabel}>Tuổi</strong>
          {isEditing ? (
            <input
              type="number"
              value={userInfo.age || ''}
              onChange={(e) => handleInputChange('age', e.target.value)}
              style={styles.inputField}
              min="1"
              max="100"
            />
          ) : (
            <p style={styles.infoValue}>{userInfo.age || 'Chưa cập nhật'}</p>
          )}
        </div>

        <div style={styles.infoRow}>
          <strong style={styles.infoLabel}>Giới tính</strong>
          {isEditing ? (
            <select
              value={userInfo.gender || ''}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              style={styles.selectField}
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          ) : (
            <p style={styles.infoValue}>
              {userInfo.gender === 'male' ? 'Nam' : 
               userInfo.gender === 'female' ? 'Nữ' : 
               userInfo.gender === 'other' ? 'Khác' : 'Chưa cập nhật'}
            </p>
          )}
        </div>
        
        <div style={styles.infoRow}>
          <strong style={styles.infoLabel}>Số điện thoại</strong>
          {isEditing ? (
            <input
              type="text"
              value={userInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              style={styles.inputField}
            />
          ) : (
            <p style={styles.infoValue}>{userInfo.phone}</p>
          )}
        </div>
        
        <div style={{...styles.infoRow, ...styles.infoRowLast}}>
          <strong style={styles.infoLabel}>Email</strong>
          {isEditing ? (
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              style={styles.inputField}
            />
          ) : (
            <p style={styles.infoValue}>{userInfo.email}</p>
          )}
        </div>

        {isEditing && (
          <div style={styles.buttonGroup}>
            <button 
              style={{...styles.button, ...styles.primaryButton}}
              onClick={handleSave}
            >
              Lưu thay đổi
            </button>
            <button 
              style={{...styles.button, ...styles.secondaryButton}}
              onClick={handleCancel}
            >
              Hủy
            </button>
          </div>
        )}
      </div>

      {/* Phần quản lý học sinh */}
      <div style={styles.studentSection}>
        <div style={styles.studentHeader}>
          <h3 style={styles.sectionTitle}>Thông tin học sinh</h3>
          <button 
            style={styles.editButton}
            onClick={() => {
              setShowStudentForm(!showStudentForm);
              setEditingStudent(null);
              setNewStudent({ name: '', class: '', school: '' });
            }}
          >
            {showStudentForm ? 'Hủy thêm' : 'Thêm học sinh'}
          </button>
        </div>

        {/* Form thêm/sửa học sinh */}
        {showStudentForm && (
          <div style={styles.studentForm}>
            <h4 style={{margin: '0 0 15px 0', color: '#333'}}>
              {editingStudent ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}
            </h4>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Họ và tên</label>
              <input
                type="text"
                value={newStudent.name}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                style={styles.inputField}
                placeholder="Nhập họ và tên học sinh"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Lớp</label>
              <input
                type="text"
                value={newStudent.class}
                onChange={(e) => setNewStudent({...newStudent, class: e.target.value})}
                style={styles.inputField}
                placeholder="Nhập lớp"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Trường</label>
              <input
                type="text"
                value={newStudent.school}
                onChange={(e) => setNewStudent({...newStudent, school: e.target.value})}
                style={styles.inputField}
                placeholder="Nhập tên trường"
              />
            </div>
            <div style={styles.formActions}>
              <button 
                style={{...styles.button, ...styles.primaryButton}}
                onClick={editingStudent ? handleUpdateStudent : handleAddStudent}
              >
                {editingStudent ? 'Cập nhật' : 'Thêm'}
              </button>
              <button 
                style={{...styles.button, ...styles.secondaryButton}}
                onClick={handleCancelStudent}
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Danh sách học sinh */}
        {students.length > 0 ? (
          students.map(student => (
            <div key={student.id} style={styles.studentCard}>
              <div style={styles.studentInfo}>
                <div style={styles.studentDetails}>
                  <h4 style={styles.studentName}>{student.name}</h4>
                  <p style={styles.studentClass}>Lớp: {student.class}</p>
                  <p style={styles.studentSchool}>Trường: {student.school}</p>
                </div>
                <div style={styles.studentActions}>
                  <button 
                    style={styles.warningButton}
                    onClick={() => handleEditStudent(student)}
                  >
                    Sửa
                  </button>
                  <button 
                    style={styles.dangerButton}
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{color: '#6c757d', textAlign: 'center', padding: '20px'}}>
            Chưa có thông tin học sinh nào
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;