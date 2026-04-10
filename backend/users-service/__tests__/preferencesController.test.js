const preferencesController = require("../controllers/preferencesController");

jest.mock("../config/db", () => ({ query: jest.fn() }));

const pool = require("../config/db");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─────────────────────────────────────────────
// getMyPreferences
// ─────────────────────────────────────────────
describe("preferencesController.getMyPreferences", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne les préférences si elles existent", async () => {
    const pref = { user_id: "uuid-1", budget_min: 300, budget_max: 700 };
    pool.query.mockResolvedValue({ rows: [pref] });

    const req = { userId: "uuid-1" };
    const res = mockRes();
    await preferencesController.getMyPreferences(req, res);

    expect(res.json).toHaveBeenCalledWith({ preferences: pref });
  });

  it("retourne null si aucune préférence", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const req = { userId: "uuid-1" };
    const res = mockRes();
    await preferencesController.getMyPreferences(req, res);

    expect(res.json).toHaveBeenCalledWith({ preferences: null });
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { userId: "uuid-1" };
    const res = mockRes();
    await preferencesController.getMyPreferences(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// upsertMyPreferences
// ─────────────────────────────────────────────
describe("preferencesController.upsertMyPreferences", () => {
  beforeEach(() => jest.clearAllMocks());

  it("crée ou met à jour les préférences et les retourne", async () => {
    const pref = { user_id: "uuid-1", budget_min: 300, budget_max: 700, location: "Paris" };
    pool.query.mockResolvedValue({ rows: [pref] });

    const req = {
      userId: "uuid-1",
      body: { budget_min: 300, budget_max: 700, location: "Paris" },
    };
    const res = mockRes();
    await preferencesController.upsertMyPreferences(req, res);

    expect(res.json).toHaveBeenCalledWith({ preferences: pref });
  });

  it("retourne 400 si contrainte CHECK violée (code 23514)", async () => {
    pool.query.mockRejectedValue({ code: "23514" });

    const req = { userId: "uuid-1", body: { budget_min: 900, budget_max: 100 } };
    const res = mockRes();
    await preferencesController.upsertMyPreferences(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Preferences invalides" });
  });

  it("passe null pour les champs absents du body", async () => {
    pool.query.mockResolvedValue({ rows: [{ user_id: "uuid-1" }] });

    const req = { userId: "uuid-1", body: {} };
    const res = mockRes();
    await preferencesController.upsertMyPreferences(req, res);

    const queryParams = pool.query.mock.calls[0][1];
    // userId est en position 0, les autres champs doivent être null
    expect(queryParams[1]).toBeNull(); // budget_min
    expect(queryParams[2]).toBeNull(); // budget_max
  });

  it("retourne 500 sur erreur DB inattendue", async () => {
    pool.query.mockRejectedValue(new Error("Unexpected DB error"));

    const req = { userId: "uuid-1", body: {} };
    const res = mockRes();
    await preferencesController.upsertMyPreferences(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// deleteMyPreferences
// ─────────────────────────────────────────────
describe("preferencesController.deleteMyPreferences", () => {
  beforeEach(() => jest.clearAllMocks());

  it("supprime les préférences et retourne un message de confirmation", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const req = { userId: "uuid-1" };
    const res = mockRes();
    await preferencesController.deleteMyPreferences(req, res);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("DELETE FROM profile_preferences"),
      ["uuid-1"]
    );
    expect(res.json).toHaveBeenCalledWith({ message: "Preferences supprimees" });
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { userId: "uuid-1" };
    const res = mockRes();
    await preferencesController.deleteMyPreferences(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
