const messagesController = require("../controllers/messagesController");

// Mock du pool avec support client (transactions)
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
// list
// ─────────────────────────────────────────────
describe("messagesController.list", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne les conversations si aucun conversation_id fourni", async () => {
    pool.query.mockResolvedValue({ rows: [{ id: "conv-1", participant_user_ids: ["u1", "u2"] }] });

    const req = { userId: "uuid-1", query: {} };
    const res = mockRes();
    await messagesController.list(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ conversations: expect.any(Array), limit: 50, offset: 0 })
    );
  });

  it("retourne 403 si l'utilisateur n'est pas participant à la conversation", async () => {
    // ensureParticipant retourne 0 row
    pool.query.mockResolvedValueOnce({ rows: [] });

    const req = { userId: "uuid-1", query: { conversation_id: "conv-1" } };
    const res = mockRes();
    await messagesController.list(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Interdit" });
  });

  it("retourne les messages d'une conversation si l'utilisateur est participant", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ 1: 1 }] }) // ensureParticipant
      .mockResolvedValueOnce({ rows: [{ id: "msg-1", body: "Bonjour" }] }); // messages

    const req = { userId: "uuid-1", query: { conversation_id: "conv-1" } };
    const res = mockRes();
    await messagesController.list(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        conversation_id: "conv-1",
        messages: expect.any(Array),
      })
    );
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { userId: "uuid-1", query: {} };
    const res = mockRes();
    await messagesController.list(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// getById
// ─────────────────────────────────────────────
describe("messagesController.getById", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne le message si l'utilisateur est participant", async () => {
    pool.query.mockResolvedValue({ rows: [{ id: "msg-1", body: "Bonjour" }] });

    const req = { userId: "uuid-1", params: { id: "msg-1" } };
    const res = mockRes();
    await messagesController.getById(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: { id: "msg-1", body: "Bonjour" } });
  });

  it("retourne 404 si le message n'existe pas ou pas participant", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const req = { userId: "uuid-1", params: { id: "msg-404" } };
    const res = mockRes();
    await messagesController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Message introuvable" });
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { userId: "uuid-1", params: { id: "msg-1" } };
    const res = mockRes();
    await messagesController.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// send
// ─────────────────────────────────────────────
describe("messagesController.send", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pool.connect.mockResolvedValue(mockClient);
    mockClient.query.mockResolvedValue({ rows: [] });
  });

  it("retourne 400 si body est vide", async () => {
    const req = { userId: "uuid-1", body: { body: "  " } };
    const res = mockRes();
    await messagesController.send(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "body requis" });
  });

  it("retourne 403 si l'utilisateur n'est pas dans la conversation existante", async () => {
    // BEGIN ok, puis vérification participant => 0 row
    mockClient.query
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({ rows: [] }); // ensureParticipant => non participant

    const req = { userId: "uuid-1", body: { body: "Bonjour", conversation_id: "conv-1" } };
    const res = mockRes();
    await messagesController.send(req, res);

    expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("retourne 400 si pas de conversation_id et pas de recipient_user_id", async () => {
    mockClient.query.mockResolvedValueOnce({}); // BEGIN

    const req = { userId: "uuid-1", body: { body: "Bonjour" } };
    const res = mockRes();
    await messagesController.send(req, res);

    expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "recipient_user_id requis si pas de conversation_id",
    });
  });

  it("crée une nouvelle conversation et envoie le message (201)", async () => {
    const newMessage = { id: "msg-new", body: "Bonjour", conversation_id: "conv-new" };
    mockClient.query
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({}) // INSERT conversations
      .mockResolvedValueOnce({}) // INSERT participants
      .mockResolvedValueOnce({ rows: [newMessage] }) // INSERT message
      .mockResolvedValueOnce({}); // COMMIT

    const req = {
      userId: "uuid-sender",
      body: { body: "Bonjour", recipient_user_id: "uuid-recipient" },
    };
    const res = mockRes();
    await messagesController.send(req, res);

    expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: newMessage });
  });

  it("envoie un message dans une conversation existante (201)", async () => {
    const newMessage = { id: "msg-new", body: "Salut", conversation_id: "conv-1" };
    mockClient.query
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({ rows: [{ 1: 1 }] }) // participant check OK
      .mockResolvedValueOnce({ rows: [newMessage] }) // INSERT message
      .mockResolvedValueOnce({}); // COMMIT

    const req = {
      userId: "uuid-1",
      body: { body: "Salut", conversation_id: "conv-1" },
    };
    const res = mockRes();
    await messagesController.send(req, res);

    expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("fait un ROLLBACK et retourne 500 sur erreur DB", async () => {
    mockClient.query
      .mockResolvedValueOnce({}) // BEGIN
      .mockRejectedValueOnce(new Error("DB error")); // INSERT échoue

    const req = {
      userId: "uuid-1",
      body: { body: "Bonjour", conversation_id: "conv-1" },
    };
    const res = mockRes();
    await messagesController.send(req, res);

    expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
