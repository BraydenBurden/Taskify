import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Ensure token is properly formatted
    const formattedToken = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
    config.headers.Authorization = formattedToken;
  } else {
    console.log("No token found in localStorage"); // Debug log
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  // Sign up new user
  signup: async (userData) => {
    try {
      const response = await api.post("/signup", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post("/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get("/user");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Resend verification email
  resendVerification: async (email) => {
    try {
      const response = await api.post("/resend-verification", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete user
  deleteUser: async (email) => {
    try {
      const response = await api.post("/delete-user", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
  },

  // Verify email
  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/verify-email/${token}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post("/request-password-reset", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post(`/reset-password/${token}`, {
        password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Task service
export const taskService = {
  // Get all tasks
  getTasks: async () => {
    try {
      const response = await api.get("/tasks");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await api.post("/tasks", taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update task status
  updateTaskStatus: async (taskId, status) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get subtasks for a task
  getSubtasks: async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}/subtasks`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add a subtask to a task
  addSubtask: async (taskId, subtaskData) => {
    try {
      const response = await api.post(`/tasks/${taskId}/subtasks`, subtaskData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a subtask
  updateSubtask: async (taskId, subtaskId, subtaskData) => {
    try {
      const response = await api.put(
        `/tasks/${taskId}/subtasks/${subtaskId}`,
        subtaskData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a subtask
  deleteSubtask: async (taskId, subtaskId) => {
    const response = await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
    return response.data;
  },
};
