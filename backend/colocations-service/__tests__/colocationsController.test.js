const colocationsController = require("../controllers/colocationsController");

const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

jest.mock("../config/db", () => ({
  query: jest.fn(),
  connect: jest.fn(),
}));

const pool = require("../config/db");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─────────────────────────────────────────────
// listListings
// ─────────────────────────────────────────────
describe("colocationsController.listListings", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne la liste des annonces publiées par défaut", async () => {
    pool.query.mockResolvedValue({ rows: [{ id: "l-1", title: "Chambre sympa" }] });

    const req = { query: {} };
    const res = mockRes();
    await colocationsController.listListings(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ listings: expect.any(Array), limit: 50, offset: 0 })
    );
  });

  it("applique les filtres city et postal_code", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const req = { query: { city: "Toulouse", postal_code: "31000" } };
    const res = mockRes();
    await colocationsController.listListings(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ listings: [] }));
  });

  it("applique les filtres min_rent et max_rent", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const req = { query: { min_rent: "300", max_rent: "600" } };
    const res = mockRes();
    await colocationsController.listListings(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ listings: [] }));
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { query: {} };
    const res = mockRes();
    await colocationsController.listListings(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// getListingById
// ─────────────────────────────────────────────
describe("colocationsController.getListingById", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne l'annonce avec ses photos", async () => {
    const listing = { id: "l-1", title: "Chambre" };
    pool.query
      .mockResolvedValueOnce({ rows: [listing] })
      .mockResolvedValueOnce({ rows: [{ id: "p-1", url: "http://example.com/photo.jpg" }] });

    const req = { params: { id: "l-1" } };
    const res = mockRes();
    await colocationsController.getListingById(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ listing, photos: expect.any(Array) })
    );
  });

  it("retourne 404 si annonce introuvable", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const req = { params: { id: "l-404" } };
    const res = mockRes();
    await colocationsController.getListingById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Annonce introuvable" });
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { params: { id: "l-1" } };
    const res = mockRes();
    await colocationsController.getListingById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// createListing
// ─────────────────────────────────────────────
describe("colocationsController.createListing", () => {
  const validBody = {
    title: "Chambre test",
    description: "Super chambre en coloc",
    rent_amount: "450",
    available_from: "2025-01-01",
    city: "Toulouse",
    postal_code: "31000",
    housing_type: "ROOM",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    pool.connect.mockResolvedValue(mockClient);
  });

  it("retourne 400 si champs requis manquants", async () => {
    const req = { userId: "uuid-owner", body: { title: "Test" }, files: [] };
    const res = mockRes();
    await colocationsController.createListing(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retourne 400 si city ou postal_code manquants", async () => {
    const req = {
      userId: "uuid-owner",
      body: { ...validBody, city: "", postal_code: "" },
      files: [],
    };
    const res = mockRes();
    await colocationsController.createListing(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Champs location requis: city, postal_code",
    });
  });

  it("retourne 400 si housing_type invalide", async () => {
    const req = {
      userId: "uuid-owner",
      body: { ...validBody, housing_type: "CASTLE" },
      files: [],
    };
    const res = mockRes();
    await colocationsController.createListing(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "housing_type invalide" });
  });

  it("crée une annonce en statut DRAFT et retourne 201", async () => {
    const newListing = { id: "l-new", title: "Chambre test", status: "DRAFT" };
    mockClient.query
      .mockResolvedValueOnce({})                     // BEGIN
      .mockResolvedValueOnce({})                     // INSERT locations
      .mockResolvedValueOnce({ rows: [newListing] }) // INSERT listings
      .mockResolvedValueOnce({})                     // DELETE listing_photos
      .mockResolvedValueOnce({});                    // COMMIT

    const req = { userId: "uuid-owner", body: validBody, files: [] };
    const res = mockRes();
    await colocationsController.createListing(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ listing: newListing });
    expect(mockClient.release).toHaveBeenCalled();
  });

  it("fait un ROLLBACK et retourne 500 sur erreur DB", async () => {
    mockClient.query
      .mockResolvedValueOnce({})                           // BEGIN
      .mockRejectedValueOnce(new Error("DB error"))        // INSERT locations fails
      .mockResolvedValueOnce({});                          // ROLLBACK

    const req = { userId: "uuid-owner", body: validBody, files: [] };
    const res = mockRes();
    await colocationsController.createListing(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(mockClient.release).toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────
// updateListing
// ─────────────────────────────────────────────
describe("colocationsController.updateListing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pool.connect.mockResolvedValue(mockClient);
  });

  it("retourne 404 si annonce introuvable", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const req = { params: { id: "l-404" }, userId: "uuid-1", body: { title: "Nouveau" } };
    const res = mockRes();
    await colocationsController.updateListing(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("retourne 403 si pas le propriétaire", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: "l-1", owner_user_id: "uuid-owner" }] });

    const req = { params: { id: "l-1" }, userId: "uuid-other", body: { title: "Nouveau" } };
    const res = mockRes();
    await colocationsController.updateListing(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("retourne 400 si housing_type invalide", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: "l-1", owner_user_id: "uuid-owner" }] });

    const req = { params: { id: "l-1" }, userId: "uuid-owner", body: { housing_type: "CASTLE" } };
    const res = mockRes();
    await colocationsController.updateListing(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "housing_type invalide" });
  });

  it("retourne 403 si tentative de publication directe", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: "l-1", owner_user_id: "uuid-owner" }] });

    const req = { params: { id: "l-1" }, userId: "uuid-owner", body: { status: "PUBLISHED" } };
    const res = mockRes();
    await colocationsController.updateListing(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Seule l'association peut publier une annonce",
    });
  });

  it("retourne 400 si aucun champ à modifier", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: "l-1", owner_user_id: "uuid-owner" }] });

    const req = { params: { id: "l-1" }, userId: "uuid-owner", body: {} };
    const res = mockRes();
    await colocationsController.updateListing(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Aucun champ a modifier" });
  });

  it("met à jour l'annonce et retourne le listing modifié", async () => {
    const updated = { id: "l-1", title: "Nouveau titre", status: "DRAFT" };
    pool.query.mockResolvedValueOnce({ rows: [{ id: "l-1", owner_user_id: "uuid-owner" }] });
    mockClient.query
      .mockResolvedValueOnce({})                    // BEGIN
      .mockResolvedValueOnce({ rows: [updated] })   // UPDATE listings
      .mockResolvedValueOnce({});                   // COMMIT

    const req = { params: { id: "l-1" }, userId: "uuid-owner", body: { title: "Nouveau titre" } };
    const res = mockRes();
    await colocationsController.updateListing(req, res);

    expect(res.json).toHaveBeenCalledWith({ listing: updated });
  });
});

// ─────────────────────────────────────────────
// deleteListing
// ─────────────────────────────────────────────
describe("colocationsController.deleteListing", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne 404 si annonce introuvable", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const req = { params: { id: "l-404" }, userId: "uuid-1" };
    const res = mockRes();
    await colocationsController.deleteListing(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("retourne 403 si pas le propriétaire", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: "l-1", owner_user_id: "uuid-owner" }] });

    const req = { params: { id: "l-1" }, userId: "uuid-other" };
    const res = mockRes();
    await colocationsController.deleteListing(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("supprime l'annonce et retourne un message de confirmation", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: "l-1", owner_user_id: "uuid-owner" }] })
      .mockResolvedValueOnce({});

    const req = { params: { id: "l-1" }, userId: "uuid-owner" };
    const res = mockRes();
    await colocationsController.deleteListing(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Annonce supprimee" });
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { params: { id: "l-1" }, userId: "uuid-owner" };
    const res = mockRes();
    await colocationsController.deleteListing(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// updateListingStatus
// ─────────────────────────────────────────────
describe("colocationsController.updateListingStatus", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne 400 si status invalide", async () => {
    const req = { params: { id: "l-1" }, body: { status: "INVALID" } };
    const res = mockRes();
    await colocationsController.updateListingStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "status invalide" });
  });

  it("retourne 404 si annonce introuvable", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const req = { params: { id: "l-404" }, body: { status: "PUBLISHED" } };
    const res = mockRes();
    await colocationsController.updateListingStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("publie une annonce et retourne le listing mis à jour", async () => {
    const updated = { id: "l-1", status: "PUBLISHED" };
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: "l-1" }] })
      .mockResolvedValueOnce({ rows: [updated] });

    const req = { params: { id: "l-1" }, body: { status: "PUBLISHED" } };
    const res = mockRes();
    await colocationsController.updateListingStatus(req, res);

    expect(res.json).toHaveBeenCalledWith({ listing: updated });
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { params: { id: "l-1" }, body: { status: "PUBLISHED" } };
    const res = mockRes();
    await colocationsController.updateListingStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// listPendingListings
// ─────────────────────────────────────────────
describe("colocationsController.listPendingListings", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne les annonces en attente avec pagination", async () => {
    pool.query.mockResolvedValue({ rows: [{ id: "l-1", status: "DRAFT" }] });

    const req = { query: {} };
    const res = mockRes();
    await colocationsController.listPendingListings(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ listings: expect.any(Array), limit: 50, offset: 0 })
    );
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { query: {} };
    const res = mockRes();
    await colocationsController.listPendingListings(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
