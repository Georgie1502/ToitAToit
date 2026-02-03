import api from './api';

export const login = async ({ email, password }) => {
  const response = await api.post('/api/auth/login', { email, password });
  const { user } = response.data || {};
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  return user;
};

export const signup = async ({ username, email, password }) => {
  const response = await api.post('/api/auth/signup', { username, email, password });
  return response.data?.message;
};

export const logout = async () => {
  try {
    await api.post('/api/auth/logout');
  } catch (err) {
    // Ignore logout errors on the client.
  }
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const raw = localStorage.getItem('user');
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
};
