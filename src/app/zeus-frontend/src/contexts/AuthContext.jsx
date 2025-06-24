import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import { AuthContext } from './AuthContextContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      // Aceita token em diferentes formatos
      const token = response.token;
      // Aceita user em diferentes formatos
      const user = response.user || response.client || response.member || (() => {
        // Se não houver user explícito, tenta extrair todos os campos exceto token
        const { token: _token, ...rest } = response;
        return Object.keys(rest).length > 0 ? rest : null;
      })();
      if (token && user) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      }
      return { success: false, error: 'Credenciais inválidas' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao fazer login'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (userData, isClient = true) => {
    try {
      const response = isClient 
        ? await authService.registerClient(userData)
        : await authService.registerMember(userData);
      
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao registrar usuário' 
      };
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

