import api from './api';

export const listPendingListings = async () => {
  const response = await api.get('/api/colocations/admin/listings');
  return response.data?.listings || [];
};

export const updateListingStatus = async (listingId, status) => {
  const response = await api.patch(`/api/colocations/admin/listings/${listingId}/status`, { status });
  return response.data?.listing;
};

export const selectCandidate = async (applicationId) => {
  const response = await api.patch(`/api/colocations/applications/${applicationId}`, { status: 'ACCEPTED' });
  return response.data?.application;
};

export const rejectApplication = async (applicationId) => {
  const response = await api.patch(`/api/colocations/applications/${applicationId}`, { status: 'REJECTED' });
  return response.data?.application;
};
