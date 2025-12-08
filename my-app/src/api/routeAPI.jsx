// src/api/route.api.js
import axiosClient from "./AxiosClient";

const routeAPI = {

  // Chuẩn hóa dữ liệu trả về (giống studentAPI)
  renListData: (res) => res.data,

  // Lấy tất cả tuyến xe
  getAllRoutes: () => axiosClient.get("/routes"),

  // Lấy tuyến theo ID
  getRouteById: (id) => axiosClient.get(`/routes/${id}`),

  // Tìm kiếm tuyến theo tên hoặc mã
  searchRoutes: (keyword) =>
    axiosClient.get(`/routes/search`, {
      params: { q: keyword },
    }),

  // Lấy tuyến theo tài xế
  getRoutesByDriver: (driverId) =>
    axiosClient.get(`/routes/driver/${driverId}`),

  // Lấy danh sách điểm dừng của tuyến
  getStopsByRoute: (routeId) =>
    axiosClient.get(`/routes/${routeId}/stops`),

  // Lấy học sinh thuộc tuyến xe
  getStudentsByRoute: (routeId) =>
    axiosClient.get(`/routes/${routeId}/students`),

  getListAllRoutes:()=>
    axiosClient.get("routes/list"),
  // Tạo tuyến mới
  createRoute: (data) => axiosClient.post("/routes", data),

  // Cập nhật tuyến
  updateRoute: (id, data) => axiosClient.put(`/routes/${id}`, data),

  // Xóa tuyến
  deleteRoute: (id) => axiosClient.delete(`/routes/${id}`),

};

export default routeAPI;
