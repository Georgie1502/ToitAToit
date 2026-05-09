import api from './api';

export const getUserById = async (id) => {
  const response = await api.get(`/api/users/${id}`);
  return response.data?.user;
};

export const getApplicantProfile = async (id) => {
  const response = await api.get(`/api/users/${id}/profile`);
  return response.data;
};
