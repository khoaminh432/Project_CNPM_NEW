import api from './api';

/**
 * Notification Service
 * Handles all notification-related API calls
 */

/**
 * Get all notifications for current user
 * @param {number} userId 
 * @param {string} role 
 * @returns {Promise} Response with notifications array
 */
export const getNotifications = async (userId, role) => {
  return await api.apiRequest(`/notifications?user_id=${userId}&role=${role}`, {
    method: 'GET'
  });
};

/**
 * Mark a notification as read
 * @param {number} notificationId 
 * @param {string} driverId - Optional driver ID to update notification_recipients
 * @returns {Promise} Response
 */
export const markAsRead = async (notificationId, driverId = null) => {
  const body = driverId ? { driver_id: driverId } : {};
  return await api.apiRequest(`/notifications/${notificationId}/read`, {
    method: 'PUT',
    body: JSON.stringify(body)
  });
};

/**
 * Mark all notifications as read for current user
 * @param {string} role 
 * @param {string} driverId - Optional driver ID to update notification_recipients
 * @returns {Promise} Response
 */
export const markAllAsRead = async (role, driverId = null) => {
  const body = { role };
  if (driverId) {
    body.driver_id = driverId;
  }
  return await api.apiRequest('/notifications/mark-all-read', {
    method: 'PUT',
    body: JSON.stringify(body)
  });
};

/**
 * Delete a notification
 * @param {number} notificationId 
 * @returns {Promise} Response
 */
export const deleteNotification = async (notificationId) => {
  return await api.apiRequest(`/notifications/${notificationId}`, {
    method: 'DELETE'
  });
};

/**
 * Delete all read notifications for current user
 * @param {string} role 
 * @param {string} driverId - Optional driver ID to delete from notification_recipients
 * @returns {Promise} Response
 */
export const deleteAllReadNotifications = async (role, driverId = null) => {
  const body = { role };
  if (driverId) {
    body.driver_id = driverId;
  }
  return await api.apiRequest('/notifications/delete-read/all', {
    method: 'DELETE',
    body: JSON.stringify(body)
  });
};
