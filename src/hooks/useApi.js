import { useState, useCallback } from 'react';

const API_BASE_URL = '/api';
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET;

// Hook para criar leads
export const useCreateLead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createLead = useCallback(async (leadData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/leads.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Erro ao criar lead');
      }

      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  return { createLead, loading, error };
};

// Hook para buscar leads (admin)
export const useGetLeads = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLeads = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const url = `${API_BASE_URL}/leads.php?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_SECRET}`
        }
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Erro ao buscar leads');
      }

      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  return { getLeads, loading, error };
};

// Hook para deletar leads (admin)
export const useDeleteLead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteLead = useCallback(async (leadId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/leads.php?id=${leadId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_SECRET}`
        }
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Erro ao deletar lead');
      }

      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  return { deleteLead, loading, error };
};

// Hook para autenticação admin
export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });

  const login = useCallback((username, password) => {
    const adminUser = import.meta.env.VITE_ADMIN_USER;
    const adminPass = import.meta.env.VITE_ADMIN_PASS;

    if (username === adminUser && password === adminPass) {
      localStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
};
