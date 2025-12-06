import api from './api';

/**
 * Schedule Service
 * Handles all schedule-related API calls
 */

/**
 * Get schedules
 * @param {string} date - Optional date filter (YYYY-MM-DD)
 * @param {string} driverId - Optional driver ID filter
 * @returns {Promise} Response with schedules array
 */
export const getSchedules = async (date = null, driverId = null) => {
  let url = '/schedules?';
  if (date) url += `date=${date}&`;
  if (driverId) url += `driver_id=${driverId}&`;
  
  return await api.apiRequest(url, {
    method: 'GET'
  });
};

/**
 * Get single schedule detail
 * @param {string} scheduleId 
 * @returns {Promise} Response with schedule data
 */
export const getScheduleDetail = async (scheduleId) => {
  return await api.apiRequest(`/schedules/${scheduleId}`, {
    method: 'GET'
  });
};

/**
 * Update schedule status
 * @param {string} scheduleId 
 * @param {string} status 
 * @returns {Promise} Response
 */
export const updateScheduleStatus = async (scheduleId, status) => {
  return await api.apiRequest(`/schedules/${scheduleId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
};
