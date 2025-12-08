// src/renderData/renderRoute.js

import routeAPI from "../api/routeAPI";

const renderRoute = {
  
  /** Lấy toàn bộ tuyến */
  getAllRoutes: async () => {
    try {
      const res = await routeAPI.getAllRoutes();
      return routeAPI.renListData(res) || [];
    } catch (error) {
      console.error("Error fetch routes:", error);
      return [];
    }
  },
  getListAllRoute: async()=>{
    try {
      const res = await routeAPI.getListAllRoutes();
      return routeAPI.renListData(res) || [];
    } catch (error) {
      console.error("Error fetch routes:", error);
      return [];
    }
  },
  /** Lấy tuyến theo ID */
  getRouteById: async (id) => {
    try {
      const res = await routeAPI.getRouteById(id);
      return routeAPI.renListData(res)|| null;
    } catch (error) {
      console.error(`Error fetch route ${id}:`, error);
      return null;
    }
  },

  /** Lấy tất cả stop của 1 route */
  getStopsByRoute: async (routeId) => {
    try {
      const res = await routeAPI.getStopsByRoute(routeId);
      return routeAPI.renListData(res) || [];
    } catch (error) {
      console.error(`Error fetch stops of route ${routeId}:`, error);
      return [];
    }
  },

  /** Tìm kiếm tuyến */
  searchRoutes: async (keyword) => {
    try {
      const res = await routeAPI.searchRoutes(keyword);
      return routeAPI.renListData(res) || [];
    } catch (error) {
      console.error("Error search routes:", error);
      return [];
    }
  },

  /** Lấy học sinh theo tuyến */
  getStudentsByRoute: async (routeId) => {
    try {
      const res = await routeAPI.getStudentsByRoute(routeId);
      return routeAPI.renListData(res) || [];
    } catch (error) {
      console.error(`Error fetch students of route ${routeId}:`, error);
      return [];
    }
  },
};

export default renderRoute;
