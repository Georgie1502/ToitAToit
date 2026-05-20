import {
  listMyApplications,
  applyToListing,
  listApplicationsForListing,
  updateApplicationStatus,
} from '../applications';
import api from '../api';

jest.mock('../api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
}));

// ─────────────────────────────────────────────
// listMyApplications
// ─────────────────────────────────────────────
describe('applications.listMyApplications', () => {
  beforeEach(() => jest.clearAllMocks());

  it('appelle GET /api/colocations/applications', async () => {
    api.get.mockResolvedValue({ data: { applications: [] } });

    await listMyApplications();

    expect(api.get).toHaveBeenCalledWith('/api/colocations/applications');
  });

  it('retourne la liste des candidatures', async () => {
    const applications = [{ id: 'app-1', status: 'SENT' }];
    api.get.mockResolvedValue({ data: { applications } });

    const result = await listMyApplications();

    expect(result).toEqual(applications);
  });

  it('retourne un tableau vide si aucune candidature', async () => {
    api.get.mockResolvedValue({ data: {} });

    const result = await listMyApplications();

    expect(result).toEqual([]);
  });

  it('propage l\'erreur si l\'API échoue', async () => {
    api.get.mockRejectedValue(new Error('Network error'));

    await expect(listMyApplications()).rejects.toThrow('Network error');
  });
});

// ─────────────────────────────────────────────
// applyToListing
// ─────────────────────────────────────────────
describe('applications.applyToListing', () => {
  beforeEach(() => jest.clearAllMocks());

  it('appelle POST /api/colocations/:id/applications avec le message', async () => {
    const application = { id: 'app-1', status: 'SENT' };
    api.post.mockResolvedValue({ data: { application } });

    await applyToListing('listing-1', 'Je suis intéressé');

    expect(api.post).toHaveBeenCalledWith(
      '/api/colocations/listing-1/applications',
      { message: 'Je suis intéressé' }
    );
  });

  it('utilise un message vide par défaut', async () => {
    api.post.mockResolvedValue({ data: { application: { id: 'app-1' } } });

    await applyToListing('listing-1');

    expect(api.post).toHaveBeenCalledWith(
      '/api/colocations/listing-1/applications',
      { message: '' }
    );
  });

  it('retourne la candidature créée', async () => {
    const application = { id: 'app-1', status: 'SENT', listing_id: 'listing-1' };
    api.post.mockResolvedValue({ data: { application } });

    const result = await applyToListing('listing-1', 'Intéressé');

    expect(result).toEqual(application);
  });

  it('propage l\'erreur 409 si candidature déjà envoyée', async () => {
    const error = new Error('Conflict');
    error.response = { status: 409 };
    api.post.mockRejectedValue(error);

    await expect(applyToListing('listing-1')).rejects.toThrow('Conflict');
  });
});

// ─────────────────────────────────────────────
// listApplicationsForListing
// ─────────────────────────────────────────────
describe('applications.listApplicationsForListing', () => {
  beforeEach(() => jest.clearAllMocks());

  it('appelle GET /api/colocations/:id/applications', async () => {
    api.get.mockResolvedValue({ data: { applications: [] } });

    await listApplicationsForListing('listing-1');

    expect(api.get).toHaveBeenCalledWith('/api/colocations/listing-1/applications');
  });

  it('retourne la liste des candidatures pour une annonce', async () => {
    const applications = [{ id: 'app-1' }, { id: 'app-2' }];
    api.get.mockResolvedValue({ data: { applications } });

    const result = await listApplicationsForListing('listing-1');

    expect(result).toEqual(applications);
  });

  it('retourne un tableau vide si aucune candidature', async () => {
    api.get.mockResolvedValue({ data: {} });

    const result = await listApplicationsForListing('listing-1');

    expect(result).toEqual([]);
  });
});

// ─────────────────────────────────────────────
// updateApplicationStatus
// ─────────────────────────────────────────────
describe('applications.updateApplicationStatus', () => {
  beforeEach(() => jest.clearAllMocks());

  it('appelle PATCH /api/colocations/applications/:id avec le statut', async () => {
    const application = { id: 'app-1', status: 'WITHDRAWN' };
    api.patch.mockResolvedValue({ data: { application } });

    await updateApplicationStatus('app-1', 'WITHDRAWN');

    expect(api.patch).toHaveBeenCalledWith(
      '/api/colocations/applications/app-1',
      { status: 'WITHDRAWN' }
    );
  });

  it('retourne la candidature mise à jour', async () => {
    const application = { id: 'app-1', status: 'ACCEPTED' };
    api.patch.mockResolvedValue({ data: { application } });

    const result = await updateApplicationStatus('app-1', 'ACCEPTED');

    expect(result).toEqual(application);
  });

  it('propage l\'erreur 403 si non autorisé', async () => {
    const error = new Error('Forbidden');
    error.response = { status: 403 };
    api.patch.mockRejectedValue(error);

    await expect(updateApplicationStatus('app-1', 'ACCEPTED')).rejects.toThrow('Forbidden');
  });
});
