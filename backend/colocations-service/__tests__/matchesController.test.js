const matchesController = require("../controllers/matchesController");

jest.mock("../config/db", () => ({ query: jest.fn() }));

const pool = require("../config/db");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─────────────────────────────────────────────
// listMyMatches
// ─────────────────────────────────────────────
describe("matchesController.listMyMatches", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne les matches de l'utilisateur avec pagination", async () => {
    pool.query.mockResolvedValue({ rows: [{ id: "m-1", status: "SUGGESTED" }] });

    const req = { userId: "uuid-1", query: {} };
    const res = mockRes();
    await matchesController.listMyMatches(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ matches: expect.any(Array), limit: 50, offset: 0 })
    );
  });

  it("respecte la pagination limit/offset", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const req = { userId: "uuid-1", query: { limit: "10", offset: "20" } };
    const res = mockRes();
    await matchesController.listMyMatches(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 10, offset: 20 })
    );
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { userId: "uuid-1", query: {} };
    const res = mockRes();
    await matchesController.listMyMatches(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// getMyMatchForListing
// ─────────────────────────────────────────────
describe("matchesController.getMyMatchForListing", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne le match si il existe", async () => {
    const match = { id: "m-1", status: "LIKED", score: 80 };
    pool.query.mockResolvedValue({ rows: [match] });

    const req = { userId: "uuid-1", params: { id: "l-1" } };
    const res = mockRes();
    await matchesController.getMyMatchForListing(req, res);

    expect(res.json).toHaveBeenCalledWith({ match });
  });

  it("retourne null si aucun match trouvé", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const req = { userId: "uuid-1", params: { id: "l-1" } };
    const res = mockRes();
    await matchesController.getMyMatchForListing(req, res);

    expect(res.json).toHaveBeenCalledWith({ match: null });
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { userId: "uuid-1", params: { id: "l-1" } };
    const res = mockRes();
    await matchesController.getMyMatchForListing(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// upsertMyMatchForListing
// ─────────────────────────────────────────────
describe("matchesController.upsertMyMatchForListing", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne 400 si status invalide", async () => {
    const req = { userId: "uuid-1", params: { id: "l-1" }, body: { status: "INVALID" } };
    const res = mockRes();
    await matchesController.upsertMyMatchForListing(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "status invalide" });
  });

  it("retourne 400 si score est négatif", async () => {
    const req = { userId: "uuid-1", params: { id: "l-1" }, body: { status: "LIKED", score: "-5" } };
    const res = mockRes();
    await matchesController.upsertMyMatchForListing(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "score invalide" });
  });

  it("retourne 404 si annonce introuvable", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const req = { userId: "uuid-1", params: { id: "l-404" }, body: { status: "LIKED" } };
    const res = mockRes();
    await matchesController.upsertMyMatchForListing(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Annonce introuvable" });
  });

  it("crée ou met à jour un match (LIKED) et le retourne", async () => {
    const match = { id: "m-1", status: "LIKED", score: 80 };
    pool.query
      .mockResolvedValueOnce({ rows: [{ 1: 1 }] }) // listing exists
      .mockResolvedValueOnce({ rows: [match] });    // upsert

    const req = { userId: "uuid-1", params: { id: "l-1" }, body: { status: "LIKED", score: "80" } };
    const res = mockRes();
    await matchesController.upsertMyMatchForListing(req, res);

    expect(res.json).toHaveBeenCalledWith({ match });
  });

  it("crée un match SUGGESTED sans score", async () => {
    const match = { id: "m-2", status: "SUGGESTED", score: null };
    pool.query
      .mockResolvedValueOnce({ rows: [{ 1: 1 }] })
      .mockResolvedValueOnce({ rows: [match] });

    const req = { userId: "uuid-1", params: { id: "l-1" }, body: {} };
    const res = mockRes();
    await matchesController.upsertMyMatchForListing(req, res);

    expect(res.json).toHaveBeenCalledWith({ match });
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ 1: 1 }] })
      .mockRejectedValueOnce(new Error("DB error"));

    const req = { userId: "uuid-1", params: { id: "l-1" }, body: { status: "LIKED" } };
    const res = mockRes();
    await matchesController.upsertMyMatchForListing(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// deleteMyMatchForListing
// ─────────────────────────────────────────────
describe("matchesController.deleteMyMatchForListing", () => {
  beforeEach(() => jest.clearAllMocks());

  it("supprime le match et retourne un message de confirmation", async () => {
    pool.query.mockResolvedValue({});

    const req = { userId: "uuid-1", params: { id: "l-1" } };
    const res = mockRes();
    await matchesController.deleteMyMatchForListing(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "Match supprime" });
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { userId: "uuid-1", params: { id: "l-1" } };
    const res = mockRes();
    await matchesController.deleteMyMatchForListing(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
