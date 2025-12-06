import axios from 'axios';

// Java API Gateway URL
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const javaApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
javaApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
javaApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH API ==========
export const authApi = {
  login: (username: string, password: string) =>
    javaApiClient.post('/auth/login', { username, password }),
  
  validateToken: (token: string) =>
    javaApiClient.post('/auth/validate', {}, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  logout: () =>
    javaApiClient.post('/auth/logout'),
};

// ========== MATERIALS API ==========
export const materialsApi = {
  // Public endpoints
  getAllMaterials: () =>
    javaApiClient.get('/materials/public/all'),
  
  getFilteredMaterials: (filters: {
    semester: string;
    group: string;
    material_type: string;
    year: string;
  }) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'All') {
        params.append(key, value);
      }
    });
    return javaApiClient.get(`/materials/public/filter?${params.toString()}`);
  },
  
  searchMaterials: (query: string) =>
    javaApiClient.get(`/materials/public/search?query=${encodeURIComponent(query)}`),
  
  uploadMaterial: (materialData: any) =>
    javaApiClient.post('/materials/upload', materialData),
  
  incrementDownload: (id: number) =>
    javaApiClient.post(`/materials/${id}/download`),
  
  // Admin endpoints
  getPendingMaterials: () =>
    javaApiClient.get('/materials/admin/pending'),
  
  getApprovedMaterials: () =>
    javaApiClient.get('/materials/admin/approved'),
  
  approveMaterial: (id: number) =>
    javaApiClient.put(`/materials/admin/${id}/approve`),
  
  rejectMaterial: (id: number) =>
    javaApiClient.delete(`/materials/admin/${id}/reject`),
  
  deleteMaterial: (id: number) =>
    javaApiClient.delete(`/materials/admin/${id}`),
};

// ========== NOTICES API ==========
export const noticesApi = {
  // Public endpoints
  getActiveNotices: () =>
    javaApiClient.get('/notices/public/active'),
  
  getRecentNotices: (limit = 5) =>
    javaApiClient.get(`/notices/public/recent?limit=${limit}`),
  
  getActiveUpdates: () =>
    javaApiClient.get('/notices/public/updates/active'),
  
  // Admin endpoints
  getAllNotices: () =>
    javaApiClient.get('/notices/admin/all'),
  
  createNotice: (noticeData: any) =>
    javaApiClient.post('/notices/admin', noticeData),
  
  updateNotice: (id: number, noticeData: any) =>
    javaApiClient.put(`/notices/admin/${id}`, noticeData),
  
  deleteNotice: (id: number) =>
    javaApiClient.delete(`/notices/admin/${id}`),
  
  toggleNoticeActive: (id: number) =>
    javaApiClient.put(`/notices/admin/${id}/toggle-active`),
  
  // Updates admin
  getAllUpdates: () =>
    javaApiClient.get('/notices/admin/updates/all'),
  
  createUpdate: (updateData: any) =>
    javaApiClient.post('/notices/admin/updates', updateData),
  
  updateUpdate: (id: number, updateData: any) =>
    javaApiClient.put(`/notices/admin/updates/${id}`, updateData),
  
  deleteUpdate: (id: number) =>
    javaApiClient.delete(`/notices/admin/updates/${id}`),
  
  toggleUpdateActive: (id: number) =>
    javaApiClient.put(`/notices/admin/updates/${id}/toggle-active`),
};

// ========== EXAMS API ==========
export const examsApi = {
  // Public endpoints
  getActiveTimetables: () =>
    javaApiClient.get('/exams/public/timetables/active'),
  
  getTimetableById: (id: number) =>
    javaApiClient.get(`/exams/public/timetables/${id}`),
  
  getActiveSliders: () =>
    javaApiClient.get('/exams/public/sliders/active'),
  
  getSetting: (key: string) =>
    javaApiClient.get(`/exams/public/settings/${key}`),
  
  // Admin endpoints
  getAllTimetables: () =>
    javaApiClient.get('/exams/admin/timetables/all'),
  
  createTimetable: (timetableData: any) =>
    javaApiClient.post('/exams/admin/timetables', timetableData),
  
  updateTimetable: (id: number, timetableData: any) =>
    javaApiClient.put(`/exams/admin/timetables/${id}`, timetableData),
  
  deleteTimetable: (id: number) =>
    javaApiClient.delete(`/exams/admin/timetables/${id}`),
  
  toggleTimetableActive: (id: number) =>
    javaApiClient.put(`/exams/admin/timetables/${id}/toggle-active`),
  
  getAllSliders: () =>
    javaApiClient.get('/exams/admin/sliders/all'),
  
  createSlider: (sliderData: any) =>
    javaApiClient.post('/exams/admin/sliders', sliderData),
  
  updateSlider: (id: number, sliderData: any) =>
    javaApiClient.put(`/exams/admin/sliders/${id}`, sliderData),
  
  deleteSlider: (id: number) =>
    javaApiClient.delete(`/exams/admin/sliders/${id}`),
  
  toggleSliderActive: (id: number) =>
    javaApiClient.put(`/exams/admin/sliders/${id}/toggle-active`),
  
  getAllSettings: () =>
    javaApiClient.get('/exams/admin/settings/all'),
  
  updateSetting: (key: string, settingData: any) =>
    javaApiClient.put(`/exams/admin/settings/${key}`, settingData),
};

// ========== FILES API ==========
export const filesApi = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return javaApiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  downloadFile: (filename: string) =>
    javaApiClient.get(`/files/download/${filename}`, {
      responseType: 'blob',
    }),
  
  viewFile: (filename: string) =>
    javaApiClient.get(`/files/public/view/${filename}`, {
      responseType: 'blob',
    }),
  
  deleteFile: (filename: string) =>
    javaApiClient.delete(`/files/admin/${filename}`),
};

// ========== LLM API ==========
export const llmApi = {
  checkResult: (rollNumber: string, resultUrl?: string) =>
    javaApiClient.post('/llm/check-result-simple', {
      rollNumber,
      resultUrl: resultUrl || 'https://mracollegevzm.com/exam-results/',
    }),
};

// ========== ADMIN API ==========
export const adminApi = {
  getDashboardStats: () =>
    javaApiClient.get('/admin/dashboard/stats'),
  
  // These proxy to other services
  getPendingMaterials: () =>
    javaApiClient.get('/admin/materials/pending'),
  
  getApprovedMaterials: () =>
    javaApiClient.get('/admin/materials/approved'),
  
  approveMaterial: (id: number) =>
    javaApiClient.put(`/admin/materials/${id}/approve`),
  
  rejectMaterial: (id: number) =>
    javaApiClient.delete(`/admin/materials/${id}/reject`),
  
  deleteMaterial: (id: number) =>
    javaApiClient.delete(`/admin/materials/${id}`),
  
  getAllNotices: () =>
    javaApiClient.get('/admin/notices'),
  
  createNotice: (noticeData: any) =>
    javaApiClient.post('/admin/notices', noticeData),
  
  updateNotice: (id: number, noticeData: any) =>
    javaApiClient.put(`/admin/notices/${id}`, noticeData),
  
  deleteNotice: (id: number) =>
    javaApiClient.delete(`/admin/notices/${id}`),
  
  toggleNoticeActive: (id: number) =>
    javaApiClient.put(`/admin/notices/${id}/toggle-active`),
  
  getAllUpdates: () =>
    javaApiClient.get('/admin/updates'),
  
  createUpdate: (updateData: any) =>
    javaApiClient.post('/admin/updates', updateData),
  
  updateUpdate: (id: number, updateData: any) =>
    javaApiClient.put(`/admin/updates/${id}`, updateData),
  
  deleteUpdate: (id: number) =>
    javaApiClient.delete(`/admin/updates/${id}`),
  
  toggleUpdateActive: (id: number) =>
    javaApiClient.put(`/admin/updates/${id}/toggle-active`),
  
  getAllTimetables: () =>
    javaApiClient.get('/admin/timetables'),
  
  createTimetable: (timetableData: any) =>
    javaApiClient.post('/admin/timetables', timetableData),
  
  updateTimetable: (id: number, timetableData: any) =>
    javaApiClient.put(`/admin/timetables/${id}`, timetableData),
  
  deleteTimetable: (id: number) =>
    javaApiClient.delete(`/admin/timetables/${id}`),
  
  toggleTimetableActive: (id: number) =>
    javaApiClient.put(`/admin/timetables/${id}/toggle-active`),
  
  getAllSliders: () =>
    javaApiClient.get('/admin/sliders'),
  
  createSlider: (sliderData: any) =>
    javaApiClient.post('/admin/sliders', sliderData),
  
  updateSlider: (id: number, sliderData: any) =>
    javaApiClient.put(`/admin/sliders/${id}`, sliderData),
  
  deleteSlider: (id: number) =>
    javaApiClient.delete(`/admin/sliders/${id}`),
  
  toggleSliderActive: (id: number) =>
    javaApiClient.put(`/admin/sliders/${id}/toggle-active`),
  
  getAllSettings: () =>
    javaApiClient.get('/admin/settings'),
  
  updateSetting: (key: string, settingData: any) =>
    javaApiClient.put(`/admin/settings/${key}`, settingData),
};

export default javaApiClient;