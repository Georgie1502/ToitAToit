const bcrypt = require("bcrypt");
const authController = require("../controllers/authController");

// --- Mocks ---
jest.mock("../config/db", () => ({ query: jest.fn() }));
jest.mock("../utils/tokenUtils", () => ({
  generateToken: jest.fn(() => "fake-token"),
}));
jest.mock("bcrypt");

const pool = require("../config/db");

// Helpers req/res
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

// ─────────────────────────────────────────────
// signup
// ─────────────────────────────────────────────
describe("authController.signup", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne 400 si username manquant", async () => {
    const req = { body: { email: "a@b.com", password: "pass" } };
    const res = mockRes();
    await authController.signup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("requis") })
    );
  });

  it("retourne 400 si email manquant", async () => {
    const req = { body: { username: "john", password: "pass" } };
    const res = mockRes();
    await authController.signup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retourne 400 si password manquant", async () => {
    const req = { body: { username: "john", email: "a@b.com" } };
    const res = mockRes();
    await authController.signup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("crée un utilisateur et retourne 201 avec token", async () => {
    bcrypt.hash.mockResolvedValue("hashed");
    pool.query.mockResolvedValue({ rows: [] });

    const req = { body: { username: "john", email: "JOHN@TEST.COM", password: "pass123" } };
    const res = mockRes();
    await authController.signup(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("pass123", 10);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO users"),
      expect.arrayContaining(["john", "john@test.com", "hashed"])
    );
    expect(res.cookie).toHaveBeenCalledWith("token", "fake-token", expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: "fake-token", user: expect.objectContaining({ email: "john@test.com" }) })
    );
  });

  it("normalise l'email en minuscules", async () => {
    bcrypt.hash.mockResolvedValue("hashed");
    pool.query.mockResolvedValue({ rows: [] });

    const req = { body: { username: "John", email: "  JOHN@TEST.COM  ", password: "pass" } };
    const res = mockRes();
    await authController.signup(req, res);

    const callArgs = pool.query.mock.calls[0][1];
    expect(callArgs[2]).toBe("john@test.com");
  });

  it("retourne 409 si email déjà utilisé (contrainte users_email)", async () => {
    bcrypt.hash.mockResolvedValue("hashed");
    pool.query.mockRejectedValue({ code: "23505", constraint: "users_email_key" });

    const req = { body: { username: "john", email: "a@b.com", password: "pass" } };
    const res = mockRes();
    await authController.signup(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Email deja utilise" })
    );
  });

  it("retourne 409 si username déjà utilisé ", async () => {
    bcrypt.hash.mockResolvedValue("hashed");
    pool.query.mockRejectedValue({ code: "23505", constraint: "users_username_key" });

    const req = { body: { username: "john", email: "a@b.com", password: "pass" } };
    const res = mockRes();
    await authController.signup(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Nom d'utilisateur deja utilise" })
    );
  });

  it("retourne 500 sur erreur inattendue", async () => {
    bcrypt.hash.mockRejectedValue(new Error("bcrypt failed"));

    const req = { body: { username: "john", email: "a@b.com", password: "pass" } };
    const res = mockRes();
    await authController.signup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// login
// ─────────────────────────────────────────────
describe("authController.login", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne 400 si email manquant", async () => {
    const req = { body: { password: "pass" } };
    const res = mockRes();
    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retourne 400 si password manquant", async () => {
    const req = { body: { email: "a@b.com" } };
    const res = mockRes();
    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("retourne 401 si utilisateur introuvable", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const req = { body: { email: "unknown@test.com", password: "pass" } };
    const res = mockRes();
    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Identifiants invalides" });
  });

  it("retourne 401 si compte supprimé (status DELETED)", async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: "uuid-1", username: "john", email: "a@b.com", password_hash: "hash", status: "DELETED" }],
    });

    const req = { body: { email: "a@b.com", password: "pass" } };
    const res = mockRes();
    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("retourne 401 si mot de passe incorrect", async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: "uuid-1", username: "john", email: "a@b.com", password_hash: "hash", status: "ACTIVE" }],
    });
    bcrypt.compare.mockResolvedValue(false);

    const req = { body: { email: "a@b.com", password: "wrong" } };
    const res = mockRes();
    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("connecte l'utilisateur et retourne un token", async () => {
    pool.query.mockResolvedValue({
      rows: [{ id: "uuid-1", username: "john", email: "a@b.com", password_hash: "hash", status: "ACTIVE" }],
    });
    bcrypt.compare.mockResolvedValue(true);

    const req = { body: { email: "a@b.com", password: "correct" } };
    const res = mockRes();
    await authController.login(req, res);

    expect(res.cookie).toHaveBeenCalledWith("token", "fake-token", expect.any(Object));
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Connexion reussie",
        token: "fake-token",
        user: expect.objectContaining({ id: "uuid-1" }),
      })
    );
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { body: { email: "a@b.com", password: "pass" } };
    const res = mockRes();
    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// logout
// ─────────────────────────────────────────────
describe("authController.logout", () => {
  it("efface le cookie et retourne un message de succès", () => {
    const req = {};
    const res = mockRes();
    authController.logout(req, res);

    expect(res.clearCookie).toHaveBeenCalledWith("token", expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({ message: "Deconnexion reussie" });
  });
});
