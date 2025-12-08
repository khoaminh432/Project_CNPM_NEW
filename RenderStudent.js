import studentAPI from "../api/studentAPI";

const renderStudent = {
  // Lấy tất cả học sinh
  getAllStudents: async () => {
    const res = await studentAPI.getAllStudents();
    return res.data.data;
  },
  getAllStudents: (booo)=>{
    return studentAPI.getAllStudents().then(res => {return(res.data.data)})

  },

  // Tìm kiếm học sinh theo keyword
  searchStudents: async (keyword) => {
    const res = await studentAPI.searchStudents(keyword);
    return res.data.data;
  },

  // Lấy thống kê học sinh
  getStatistics: async () => {
    const res = await studentAPI.getStatistics();
    return res.data.data;
  },

  // Lấy học sinh theo ID
  getStudentByID: async (id) => {
    const res = await studentAPI.getStudentById(id);
    return res.data.data;
  },

  // Lấy học sinh + lịch đón
  getStudentWithSchedule: async (id) => {
    const res = await studentAPI.getStudentWithSchedule(id);
    return res.data.data;
  },

  // Lấy học sinh theo phụ huynh
  getStudentsByParent: async (parentId) => {
    const res = await studentAPI.getStudentsByParent(parentId);
    return res.data.data;
  },

  // Lấy học sinh theo điểm đón
  getStudentsByPickupStop: async (stopId) => {
    const res = await studentAPI.getStudentsByPickupStop(stopId);
    return res.data.data;
  },

  // Lấy học sinh theo trường
  getStudentsBySchool: async (schoolName) => {
    const res = await studentAPI.getStudentsBySchool(schoolName);
    return res.data.data;
  },

  // Tạo học sinh mới
  createStudent: async (data) => {
    const res = await studentAPI.createStudent(data);
    return res.data.data;
  },

  // Cập nhật học sinh
  updateStudent: async (id, data) => {
    const res = await studentAPI.updateStudent(id, data);
    return res.data.data;
  },

  // Xóa học sinh
  deleteStudent: async (id) => {
    const res = await studentAPI.deleteStudent(id);
    return res.data.data;
  }
};

export default renderStudent;
