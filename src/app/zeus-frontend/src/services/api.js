import axios from 'axios';

const API_BASE_URL = 'http://localhost:4001';

// Criar instância do axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Log para debugar o header em todas as requisições
      console.log('[API] Authorization header enviado:', config.headers.Authorization, 'para', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log para debugar erro 401
    if (error.response?.status === 401) {
      console.warn('[API] Erro 401 recebido em:', error.config?.url);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de Autenticação
export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    // Supondo que o token venha em response.data.token
    const token = response.data.token || response.data.accessToken;
    if (token) {
      localStorage.setItem('authToken', token);
      console.log('[API] Token salvo no localStorage:', token);
    } else {
      localStorage.removeItem('authToken');
      console.log('[API] Token não recebido no login!');
    }
    return response.data;
  },
  
  registerClient: async (userData) => {
    const response = await apiClient.post('/auth/register-client', userData);
    return response.data;
  },
  
  registerMember: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },
  
  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  forgotPasswordClient: async (email) => {
    const response = await apiClient.post('/auth/forgot-password-client', { email });
    return response.data;
  },
  
  resetPassword: async (token, password) => {
    const response = await apiClient.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  resetPasswordClient: async (token, password) => {
    const response = await apiClient.post(`/auth/reset-password-client/${token}`, { password });
    return response.data;
  },
};

// Serviços de Clientes
export const clientService = {
  getAll: async () => {
    const response = await apiClient.get('/client');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/client/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/client', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await apiClient.put(`/client/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/client/${id}`);
    return response.data;
  },

  deletePublic: async (id) => {
    const response = await apiClient.delete(`/client/delete/clients/${id}`);
    return response.data;
  },
  
  uploadPhoto: async (id, photoFile) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    const response = await apiClient.post(`/client/upload-photo/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Serviços de Membros
export const memberService = {
  getAll: async () => {
    const response = await apiClient.get('/member');
    return response.data;
  },

  getAllPublic: async () => {
    const response = await apiClient.get('/member/public');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/member/${id}`);
    return response.data;
  },

  getByIdPublic: async (id) => {
    const response = await apiClient.get(`/member/public/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/member', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await apiClient.put(`/member/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/member/${id}?confirm=true`);
    return response.data;
  },

  deletePublic: async (id) => {
    const response = await apiClient.delete(`/member/members-delete/${id}`);
    return response.data;
  },
  
  uploadPhoto: async (id, photoFile) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    const response = await apiClient.post(`/member/upload-photo/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Serviços de Projetos
export const projectService = {
  getAll: async () => {
    const response = await apiClient.get('/project');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/project/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await apiClient.post('/project', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await apiClient.put(`/project/${id}`, data);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await apiClient.put(`/project/${id}/status`, { status });
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/project/${id}`);
    return response.data;
  },
};

// Serviços de Equipamentos
export const equipmentService = {
  getAll: async () => {
    const response = await apiClient.get('/equipment');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/equipment/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await apiClient.post('/equipment', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await apiClient.put(`/equipment/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/equipment/${id}`);
    return response.data;
  },

  checkOut: async (id, memberId) => {
    const response = await apiClient.put(`/equipment/${id}/check-out`, { memberId });
    return response.data;
  },

  checkIn: async (id) => {
    const response = await apiClient.put(`/equipment/${id}/check-in`);
    return response.data;
  },
};

// Serviços de Penalidades
export const penaltyService = {
  getAll: async () => {
    const response = await apiClient.get('/penalty');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/penalty/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await apiClient.post('/penalty', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await apiClient.put(`/penalty/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/penalty/${id}`);
    return response.data;
  },
};

// Serviços de Orçamentos
export const budgetService = {
  create: async (data) => {
    const response = await apiClient.post('/budgets-create', data);
    return response.data;
  },
  
  getAll: async () => {
    const response = await apiClient.get('/project');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/project/${id}`);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await apiClient.put(`/project/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/project/${id}?confirm=true`);
    return response.data;
  },
};

// Serviço de Health Check
export const healthService = {
  check: async () => {
    const response = await apiClient.get('/healthcheck');
    return response.data;
  },
};

export default apiClient;

