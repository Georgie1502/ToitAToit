import api from './api';

export const listMyApplications = async () => {
  const response = await api.get('/api/colocations/applications');
  return response.data?.applications || [];
};

export const applyToListing = async (listingId, message = '') => {
  const response = await api.post(`/api/colocations/${listingId}/applications`, { message });
  return response.data?.application;
};

export const listApplicationsForListing = async (listingId) => {
  const response = await api.get(`/api/colocations/${listingId}/applications`);
  return response.data?.applications || [];
};

export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.patch(`/api/colocations/applications/${applicationId}`, { status });
  return response.data?.application;
};
