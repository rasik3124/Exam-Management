// src/api/rooms.js
import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API service for room management
 */
export const roomsAPI = {
  /**
   * Fetch all rooms
   */
  async getRooms() {
    try {
      const response = await apiClient.get('/rooms');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      throw error;
    }
  },

  /**
   * Save room layout
   */
  async saveRoom(roomData) {
    try {
      const response = await apiClient.post('/rooms', roomData);
      return response.data;
    } catch (error) {
      console.error('Failed to save room:', error);
      throw error;
    }
  },

  /**
   * Update existing room
   */
  async updateRoom(roomId, roomData) {
    try {
      const response = await apiClient.put(`/rooms/${roomId}`, roomData);
      return response.data;
    } catch (error) {
      console.error('Failed to update room:', error);
      throw error;
    }
  },

  /**
   * Delete room
   */
  async deleteRoom(roomId) {
    try {
      const response = await apiClient.delete(`/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete room:', error);
      throw error;
    }
  }
};

export default roomsAPI;