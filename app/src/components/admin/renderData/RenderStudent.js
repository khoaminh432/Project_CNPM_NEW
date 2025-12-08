import studentAPI from "../api/studentAPI";
import { Student } from "../models/bus_mapDB";

const renderStudent = {
  // Lấy tất cả học sinh
  getAllStudents: async () => {
    try {
      const res = await studentAPI.getAllStudents();
      return res.data.data.map(item => new Student(item));
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];
    }
  },

  // Tìm kiếm học sinh theo keyword
  searchStudents: async (keyword) => {
    try {
      const res = await studentAPI.searchStudents(keyword);
      return res.data.data.map(item => new Student(item));
    } catch (error) {
      console.error("Error searching students:", error);
      return [];
    }
  },

  // Lấy thống kê học sinh
  getStatistics: async () => {
    try {
      const res = await studentAPI.getStatistics();
      return res.data.data;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return null;
    }
  },

  // Lấy học sinh theo ID
  getStudentByID: async (id) => {
    try {
      const res = await studentAPI.getStudentById(id);
      return new Student(res.data.data);
    } catch (error) {
      console.error("Error fetching student by ID:", error);
      return null;
    }
  },

  // Tạo học sinh mới
  createStudent: async (data) => {
    try {
      const res = await studentAPI.createStudent(data);
      return res.data.data;
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  },

  // Cập nhật học sinh
  updateStudent: async (id, data) => {
    try {
      const res = await studentAPI.updateStudent(id, data);
      return res.data.data;
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  },

  // Xóa học sinh
  deleteStudent: async (id) => {
    try {
      const res = await studentAPI.deleteStudent(id);
      return res.data;
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  }
};

export default renderStudent;
