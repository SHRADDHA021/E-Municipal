import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return {
      token,
      role: localStorage.getItem('role'),
      name: localStorage.getItem('name'),
      userId: parseInt(localStorage.getItem('userId'))
    };
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sync check if needed, but the init above covers the refresh
    if (!user) {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({
                token,
                role: localStorage.getItem('role'),
                name: localStorage.getItem('name'),
                userId: parseInt(localStorage.getItem('userId'))
            });
        }
    }
  }, []);

  const login = async (email, password, role) => {
    const { data } = await api.post('/auth/login', { email, password, role });
    
    // Support both PascalCase (backend default) and camelCase (newly configured)
    const token = data.token || data.Token;
    const userRole = data.role || data.Role;
    const name = data.name || data.Name;
    const userId = data.userId || data.UserId || data.IDNo || data.idNo;

    localStorage.setItem('token', token);
    localStorage.setItem('role', userRole);
    localStorage.setItem('name', name);
    localStorage.setItem('userId', userId);
    
    setUser({ token, role: userRole, name, userId: parseInt(userId) });
    return { token, role: userRole, name, userId: parseInt(userId) };
  };

  const register = async (dto) => {
    await api.post('/auth/register', dto);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontSize:'1.2rem',fontFamily:'Inter,sans-serif',color:'#6366f1' }}>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
