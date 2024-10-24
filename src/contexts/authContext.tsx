import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const login = async (email, password) => {
        const response = await axios.post('login', { email, password });
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
    };

    const logout = async () => {
        await axios.post('api/logout', {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const register = async (name, email, password) => {
        await axios.post('api/register', { name, email, password });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
