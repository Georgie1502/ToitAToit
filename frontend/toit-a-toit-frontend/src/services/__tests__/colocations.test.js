import {
  createListing,
  listListings,
  getListingById,
  updateListing,
  deleteListing,
} from '../colocations';
import api from '../api';

jest.mock('../api', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// ─────────────────────────────────────────────
// createListing
// ─────────────────────────────────────────────
describe('colocations.createListing', () => {
  beforeEach(() => jest.clearAllMocks());

  it('appelle POST /api/colocations avec le payload', async () => {
    const listing = { id: 'l-1', title: 'Chambre sympa' };
    api.post.mockResolvedValue({ data: { listing } });

    const payload = { title: 'Chambre sympa', rent_amount: 500 };
    await createListing(payload);

    expect(api.post).toHaveBeenCalledWith('/api/colocations', payload);
  });

  it('retourne l\'annonce créée', async () => {
    const listing = { id: 'l-1', title: 'Chambre sympa' };
    api.post.mockResolvedValue({ data: { listing } });

    const result = await createListing({ title: 'Chambre sympa' });

    expect(result).toEqual(listing);
  });

  it('propage l\'erreur si l\'API échoue', async () => {
    api.post.mockRejectedValue(new Error('Forbidden'));

    await expect(createListing({ title: 'Test' })).rejects.toThrow('Forbidden');
  });
});

// ─────────────────────────────────────────────
// listListings
// ─────────────────────────────────────────────
describe('colocations.listListings', () => {
  beforeEach(() => jest.clearAllMocks());

  it('appelle GET /api/colocations sans paramètres par défaut', async () => {
    api.get.mockResolvedValue({ data: { listings: [] } });

    await listListings();

    expect(api.get).toHaveBeenCalledWith('/api/colocations', { params: {} });
  });

  it('passe les filtres en paramètres de requête', async () => {
    api.get.mockResolvedValue({ data: { listings: [] } });

    await listListings({ city: 'Paris', min_rent: 300 });

    expect(api.get).toHaveBeenCalledWith('/api/colocations', {
      params: { city: 'Paris', min_rent: 300 },
    });
  });

  it('retourne un tableau vide si aucune annonce', async () => {
    api.get.mockResolvedValue({ data: {} });

    const result = await listListings();

    expect(result).toEqual([]);
  });

  it('retourne la liste des annonces', async () => {
    const listings = [{ id: 'l-1' }, { id: 'l-2' }];
    api.get.mockResolvedValue({ data: { listings } });

    const result = await listListings();

    expect(result).toEqual(listings);
  });
});

// ─────────────────────────────────────────────
// getListingById
// ─────────────────────────────────────────────
describe('colocations.getListingById', () => {
  beforeEach(() => jest.clearAllMocks());

  it('appelle GET /api/colocations/:id', async () => {
    api.get.mockResolvedValue({ data: { listing: { id: 'l-1' } } });

    await getListingById('l-1');

    expect(api.get).toHaveBeenCalledWith('/api/colocations/l-1');
  });

  it('retourne les données de l\'annonce', async () => {
    const data = { listing: { id: 'l-1', title: 'Chambre' } };
    api.get.mockResolvedValue({ data });

    const result = await getListingById('l-1');

    expect(result).toEqual(data);
  });

  it('propage l\'erreur 404 si annonce introuvable', async () => {
    api.get.mockRejectedValue({ response: { status: 404 } });

    await expect(getListingById('nonexistent')).rejects.toBeDefined();
  });
});

// ─────────────────────────────────────────────
// updateListing
// ─────────────────────────────────────────────
describe('colocations.updateListing', () => {
  beforeEach(() => jest.clearAllMocks());

  it('appelle PUT /api/colocations/:id avec le payload', async () => {
    const listing = { id: 'l-1', title: 'Updated' };
    api.put.mockResolvedValue({ data: { listing } });

    await updateListing('l-1', { title: 'Updated' });

    expect(api.put).toHaveBeenCalledWith('/api/colocations/l-1', { title: 'Updated' });
  });

  it('retourne l\'annonce mise à jour', async () => {
    const listing = { id: 'l-1', title: 'Updated' };
    api.put.mockResolvedValue({ data: { listing } });

    const result = await updateListing('l-1', { title: 'Updated' });

    expect(result).toEqual(listing);
  });
});

// ─────────────────────────────────────────────
// deleteListing
// ─────────────────────────────────────────────
describe('colocations.deleteListing', () => {
  beforeEach(() => jest.clearAllMocks());

  it('appelle DELETE /api/colocations/:id', async () => {
    api.delete.mockResolvedValue({ data: { message: 'Annonce supprimee' } });

    await deleteListing('l-1');

    expect(api.delete).toHaveBeenCalledWith('/api/colocations/l-1');
  });

  it('retourne la réponse de suppression', async () => {
    const data = { message: 'Annonce supprimee' };
    api.delete.mockResolvedValue({ data });

    const result = await deleteListing('l-1');

    expect(result).toEqual(data);
  });

  it('propage l\'erreur 403 si pas propriétaire', async () => {
    api.delete.mockRejectedValue({ response: { status: 403 } });

    await expect(deleteListing('l-1')).rejects.toBeDefined();
  });
});
