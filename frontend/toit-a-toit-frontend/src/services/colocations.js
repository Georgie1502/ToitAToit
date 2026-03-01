import api from './api';

export const createListing = async (payload) => {
  const response = await api.post('/api/colocations', payload);
  return response.data?.listing;
};

export const listListings = async (params = {}) => {
  const response = await api.get('/api/colocations', { params });
  return response.data?.listings || [];
};

export const getListingById = async (id) => {
  const response = await api.get(`/api/colocations/${id}`);
  return response.data;
};

export const updateListing = async (id, payload) => {
  const response = await api.put(`/api/colocations/${id}`, payload);
  return response.data?.listing;
};

export const deleteListing = async (id) => {
  const response = await api.delete(`/api/colocations/${id}`);
  return response.data;
};
