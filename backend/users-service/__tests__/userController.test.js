const userController = require("../controllers/userController");

jest.mock("../config/db", () => ({ query: jest.fn() }));
jest.mock("../models/User", () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  updateUsername: jest.fn(),
  softDeleteById: jest.fn(),
}));

const pool = require("../config/db");
const User = require("../models/User");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─────────────────────────────────────────────
// listUsers
// ─────────────────────────────────────────────
describe("userController.listUsers", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne la liste des utilisateurs avec limit et offset par défaut", async () => {
    User.findAll.mockResolvedValue([{ id: "1", username: "john" }]);

    const req = { query: {} };
    const res = mockRes();
    await userController.listUsers(req, res);

    expect(User.findAll).toHaveBeenCalledWith({ limit: 50, offset: 0 });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ users: expect.any(Array), limit: 50, offset: 0 })
    );
  });

  it("limite à 200 même si limit > 200 est demandé", async () => {
    User.findAll.mockResolvedValue([]);

    const req = { query: { limit: "500", offset: "10" } };
    const res = mockRes();
    await userController.listUsers(req, res);

    expect(User.findAll).toHaveBeenCalledWith({ limit: 200, offset: 10 });
  });

  it("retourne 500 sur erreur DB", async () => {
    User.findAll.mockRejectedValue(new Error("DB error"));

    const req = { query: {} };
    const res = mockRes();
    await userController.listUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// getUserById
// ─────────────────────────────────────────────
describe("userController.getUserById", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne l'utilisateur trouvé", async () => {
    User.findById.mockResolvedValue({ id: "uuid-1", username: "john" });

    const req = { params: { id: "uuid-1" } };
    const res = mockRes();
    await userController.getUserById(req, res);

    expect(res.json).toHaveBeenCalledWith({ user: { id: "uuid-1", username: "john" } });
  });

  it("retourne 404 si utilisateur introuvable", async () => {
    User.findById.mockResolvedValue(null);

    const req = { params: { id: "nonexistent" } };
    const res = mockRes();
    await userController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Utilisateur introuvable" });
  });

  it("retourne 500 sur erreur DB", async () => {
    User.findById.mockRejectedValue(new Error("DB error"));

    const req = { params: { id: "uuid-1" } };
    const res = mockRes();
    await userController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// updateUser
// ─────────────────────────────────────────────
describe("userController.updateUser", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne 403 si l'utilisateur connecté n'est pas le propriétaire du compte", async () => {
    const req = { params: { id: "uuid-1" }, userId: "uuid-2", body: { username: "new" } };
    const res = mockRes();
    await userController.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Interdit" });
  });

  it("retourne 400 si username vide", async () => {
    const req = { params: { id: "uuid-1" }, userId: "uuid-1", body: { username: "  " } };
    const res = mockRes();
    await userController.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "username requis" });
  });

  it("met à jour le username et retourne l'utilisateur", async () => {
    User.updateUsername.mockResolvedValue({ id: "uuid-1", username: "new-name" });

    const req = { params: { id: "uuid-1" }, userId: "uuid-1", body: { username: "new-name" } };
    const res = mockRes();
    await userController.updateUser(req, res);

    expect(User.updateUsername).toHaveBeenCalledWith("uuid-1", { username: "new-name" });
    expect(res.json).toHaveBeenCalledWith({ user: { id: "uuid-1", username: "new-name" } });
  });

  it("retourne 409 si username déjà utilisé", async () => {
    User.updateUsername.mockRejectedValue({ code: "23505" });

    const req = { params: { id: "uuid-1" }, userId: "uuid-1", body: { username: "taken" } };
    const res = mockRes();
    await userController.updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
  });
});

// ─────────────────────────────────────────────
// deleteUser
// ─────────────────────────────────────────────
describe("userController.deleteUser", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne 403 si l'utilisateur ne peut pas supprimer un autre compte", async () => {
    const req = { params: { id: "uuid-1" }, userId: "uuid-2" };
    const res = mockRes();
    await userController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("supprime l'utilisateur (soft delete) et le retourne", async () => {
    User.softDeleteById.mockResolvedValue({ id: "uuid-1", status: "DELETED" });

    const req = { params: { id: "uuid-1" }, userId: "uuid-1" };
    const res = mockRes();
    await userController.deleteUser(req, res);

    expect(User.softDeleteById).toHaveBeenCalledWith("uuid-1");
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ user: expect.objectContaining({ status: "DELETED" }) })
    );
  });

  it("retourne 404 si l'utilisateur n'existe pas", async () => {
    User.softDeleteById.mockResolvedValue(null);

    const req = { params: { id: "uuid-1" }, userId: "uuid-1" };
    const res = mockRes();
    await userController.deleteUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ─────────────────────────────────────────────
// upsertMyProfile
// ─────────────────────────────────────────────
describe("userController.upsertMyProfile", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne 400 si le role est invalide", async () => {
    const req = { userId: "uuid-1", body: { role: "INVALID_ROLE" } };
    const res = mockRes();
    await userController.upsertMyProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "role invalide" });
  });

  it("accepte OWNER comme role valide", async () => {
    pool.query.mockResolvedValue({
      rows: [{ user_id: "uuid-1", role: "OWNER", bio: null }],
    });

    const req = { userId: "uuid-1", body: { role: "OWNER" } };
    const res = mockRes();
    await userController.upsertMyProfile(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ profile: expect.objectContaining({ role: "OWNER" }) })
    );
  });

  it("accepte SEEKER comme role valide", async () => {
    pool.query.mockResolvedValue({
      rows: [{ user_id: "uuid-1", role: "SEEKER", bio: null }],
    });

    const req = { userId: "uuid-1", body: { role: "SEEKER" } };
    const res = mockRes();
    await userController.upsertMyProfile(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ profile: expect.objectContaining({ role: "SEEKER" }) })
    );
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { userId: "uuid-1", body: { role: "OWNER" } };
    const res = mockRes();
    await userController.upsertMyProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// batchUsers
// ─────────────────────────────────────────────
describe("userController.batchUsers", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne 400 si ids est vide", async () => {
    const req = { body: { ids: [] } };
    const res = mockRes();
    await userController.batchUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "ids[] requis" });
  });

  it("retourne 400 si plus de 200 ids", async () => {
    const req = { body: { ids: Array(201).fill("uuid") } };
    const res = mockRes();
    await userController.batchUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Trop d'ids (max 200)" });
  });

  it("retourne les utilisateurs correspondants aux ids", async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: "uuid-1", username: "john", email: "a@b.com", status: "ACTIVE" }],
    });

    const req = { body: { ids: ["uuid-1"] } };
    const res = mockRes();
    await userController.batchUsers(req, res);

    expect(res.json).toHaveBeenCalledWith({ users: expect.any(Array) });
  });
});
