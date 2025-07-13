import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isTokenValid = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const fetchUserData = async (token: string) => {
      try {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('token');
          }
          setUser(null);
        } else {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem('token');
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    const checkAuth = () => {
      if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem('token');
        if (token && isTokenValid(token)) {
          fetchUserData(token);
        } else {
          localStorage.removeItem('token');
          setUser(null);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro no login');
      }

      if (data.token && data.user) {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('token', data.token);
        }
        setUser(data.user);
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
        
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Erro no login' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao fazer login' };
    }
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro no registro');
      }

      if (data.token && data.user) {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('token', data.token);
        }
        setUser(data.user);
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
        
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Erro ao registrar' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Erro ao registrar' };
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
    }
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};