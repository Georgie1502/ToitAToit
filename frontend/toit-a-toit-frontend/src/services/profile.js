import api from './api';

export const getMyProfile = async () => {
  const response = await api.get('/api/users/profile');
  return response.data;
};

export const upsertMyProfile = async (payload) => {
  const response = await api.put('/api/users/profile', payload);
  return response.data?.profile;
};
