import api from './api';

export const getMyPreferences = async () => {
  const response = await api.get('/api/preferences');
  return response.data?.preferences || null;
};

export const upsertMyPreferences = async (payload) => {
  const response = await api.post('/api/preferences', payload);
  return response.data?.preferences || null;
};

export const deleteMyPreferences = async () => {
  const response = await api.delete('/api/preferences');
  return response.data;
};
