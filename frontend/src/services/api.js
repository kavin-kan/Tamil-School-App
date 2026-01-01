import axios from 'axios';
import { auth } from '../config/firebase';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions
export const getStudentProgress = async (studentId) => {
  const response = await api.get(`/students/${studentId}/progress`);
  return response.data;
};

export const getStudentSkills = async (studentId) => {
  const response = await api.get(`/students/${studentId}/skills`);
  return response.data;
};

export const updateStudentSkill = async (studentId, skillCategory, level, notes = '') => {
  const response = await api.put(`/students/${studentId}/skills/${skillCategory}`, {
    level,
    notes
  });
  return response.data;
};

export const getStudentAssignments = async (studentId) => {
  const response = await api.get(`/students/${studentId}/assignments`);
  return response.data;
};

export const createAssignment = async (studentId, assignmentData) => {
  const response = await api.post(`/students/${studentId}/assignments`, assignmentData);
  return response.data;
};

export const getStudentAttendance = async (studentId) => {
  const response = await api.get(`/students/${studentId}/attendance`);
  return response.data;
};

export const markAttendance = async (studentId, attendanceData) => {
  const response = await api.post(`/students/${studentId}/attendance`, attendanceData);
  return response.data;
};

export const getStudentFeedback = async (studentId) => {
  const response = await api.get(`/students/${studentId}/feedback`);
  return response.data;
};

export const createFeedback = async (studentId, feedbackData) => {
  const response = await api.post(`/students/${studentId}/feedback`, feedbackData);
  return response.data;
};

export default api;

