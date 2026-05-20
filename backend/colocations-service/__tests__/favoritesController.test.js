const favoritesController = require("../controllers/favoritesController");

jest.mock("../config/db", () => ({ query: jest.fn() }));

const pool = require("../config/db");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─────────────────────────────────────────────
// listMyFavorites
// ─────────────────────────────────────────────
describe("favoritesController.listMyFavorites", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne les favoris de l'utilisateur avec pagination", async () => {
    pool.query.mockResolvedValue({ rows: [{ listing_id: "l-1", title: "Chambre" }] });

    const req = { userId: "uuid-1", query: {} };
    const res = mockRes();
    await favoritesController.listMyFavorites(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ favorites: expect.any(Array), limit: 50, offset: 0 })
    );
  });

  it("respecte la pagination limit/offset", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const req = { userId: "uuid-1", query: { limit: "5", offset: "10" } };
    const res = mockRes();
    await favoritesController.listMyFavorites(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 5, offset: 10 })
    );
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { userId: "uuid-1", query: {} };
    const res = mockRes();
    await favoritesController.listMyFavorites(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// addFavorite
// ─────────────────────────────────────────────
describe("favoritesController.addFavorite", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne 404 si annonce introuvable", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const req = { userId: "uuid-1", params: { id: "l-404" } };
    const res = mockRes();
    await favoritesController.addFavorite(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Annonce introuvable" });
  });

  it("ajoute aux favoris et retourne 201", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ 1: 1 }] }) // listing exists
      .mockResolvedValueOnce({});                   // INSERT favorites

    const req = { userId: "uuid-1", params: { id: "l-1" } };
    const res = mockRes();
    await favoritesController.addFavorite(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "Ajoute aux favoris" });
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { userId: "uuid-1", params: { id: "l-1" } };
    const res = mockRes();
    await favoritesController.addFavorite(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// removeFavorite
// ─────────────────────────────────────────────
describe("favoritesController.removeFavorite", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retire des favoris et retourne un message de confirmation", async () => {
    pool.query.mockResolvedValue({});

    const req = { userId: "uuid-1", params: { id: "l-1" } };
    const res = mockRes();
    await favoritesController.removeFavorite(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Retire des favoris" });
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { userId: "uuid-1", params: { id: "l-1" } };
    const res = mockRes();
    await favoritesController.removeFavorite(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
