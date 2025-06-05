import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nome = localStorage.getItem('nomeUsuario');

    if (token && nome) {
      setUsuario({ nome });
    }

    setCarregando(false);
  }, []);

  const login = ({ token, clienteId, nome }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('clienteId', clienteId);
    localStorage.setItem('nomeUsuario', nome);
    setUsuario({ nome });
  };

  const logout = () => {
    localStorage.clear();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  );
};
