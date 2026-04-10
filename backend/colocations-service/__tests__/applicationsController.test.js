const applicationsController = require("../controllers/applicationsController");

jest.mock("../config/db", () => ({ query: jest.fn() }));

const pool = require("../config/db");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─────────────────────────────────────────────
// listMyApplications
// ─────────────────────────────────────────────
describe("applicationsController.listMyApplications", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne les candidatures de l'utilisateur avec pagination", async () => {
    pool.query.mockResolvedValue({ rows: [{ id: "app-1", status: "SENT" }] });

    const req = { userId: "uuid-1", query: {} };
    const res = mockRes();
    await applicationsController.listMyApplications(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ applications: expect.any(Array), limit: 50, offset: 0 })
    );
  });

  it("retourne 500 sur erreur DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));

    const req = { userId: "uuid-1", query: {} };
    const res = mockRes();
    await applicationsController.listMyApplications(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ─────────────────────────────────────────────
// listApplicationsForListing
// ─────────────────────────────────────────────
describe("applicationsController.listApplicationsForListing", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne 404 si l'annonce n'existe pas", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const req = { params: { id: "listing-404" }, userId: "uuid-1" };
    const res = mockRes();
    await applicationsController.listApplicationsForListing(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Annonce introuvable" });
  });

  it("retourne 403 si l'utilisateur n'est pas le propriétaire", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: "listing-1", owner_user_id: "owner-uuid" }] });

    const req = { params: { id: "listing-1" }, userId: "other-uuid" };
    const res = mockRes();
    await applicationsController.listApplicationsForListing(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Interdit" });
  });

  it("retourne les candidatures si l'utilisateur est le propriétaire", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: "listing-1", owner_user_id: "uuid-owner" }] })
      .mockResolvedValueOnce({ rows: [{ id: "app-1", status: "SENT" }] });

    const req = { params: { id: "listing-1" }, userId: "uuid-owner" };
    const res = mockRes();
    await applicationsController.listApplicationsForListing(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ listing_id: "listing-1", applications: expect.any(Array) })
    );
  });
});

// ─────────────────────────────────────────────
// applyToListing
// ─────────────────────────────────────────────
describe("applicationsController.applyToListing", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne 404 si l'annonce n'existe pas", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const req = { params: { id: "listing-404" }, userId: "uuid-1", body: {} };
    const res = mockRes();
    await applicationsController.applyToListing(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("retourne 400 si l'utilisateur tente de candidater à sa propre annonce", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: "listing-1", owner_user_id: "uuid-owner", status: "PUBLISHED" }],
    });

    const req = { params: { id: "listing-1" }, userId: "uuid-owner", body: {} };
    const res = mockRes();
    await applicationsController.applyToListing(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Tu ne peux pas candidater a ta propre annonce" })
    );
  });

  it("retourne 409 si candidature déjà envoyée (statut non WITHDRAWN)", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: "listing-1", owner_user_id: "uuid-owner", status: "PUBLISHED" }] })
      .mockResolvedValueOnce({ rows: [{ id: "app-1", status: "SENT" }] });

    const req = { params: { id: "listing-1" }, userId: "uuid-applicant", body: {} };
    const res = mockRes();
    await applicationsController.applyToListing(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: "Candidature deja envoyee" });
  });

  it("recrée une candidature si l'ancienne était WITHDRAWN", async () => {
    const updatedApp = { id: "app-1", status: "SENT", message: "Je suis intéressé" };
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: "listing-1", owner_user_id: "uuid-owner", status: "PUBLISHED" }] })
      .mockResolvedValueOnce({ rows: [{ id: "app-1", status: "WITHDRAWN" }] })
      .mockResolvedValueOnce({ rows: [updatedApp] });

    const req = { params: { id: "listing-1" }, userId: "uuid-applicant", body: { message: "Je suis intéressé" } };
    const res = mockRes();
    await applicationsController.applyToListing(req, res);

    expect(res.json).toHaveBeenCalledWith({ application: updatedApp });
  });

  it("crée une nouvelle candidature et retourne 201", async () => {
    const newApp = { id: "app-new", status: "SENT", message: null };
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: "listing-1", owner_user_id: "uuid-owner", status: "PUBLISHED" }] })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [newApp] });

    const req = { params: { id: "listing-1" }, userId: "uuid-applicant", body: {} };
    const res = mockRes();
    await applicationsController.applyToListing(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ application: newApp });
  });
});

// ─────────────────────────────────────────────
// updateApplicationStatus
// ─────────────────────────────────────────────
describe("applicationsController.updateApplicationStatus", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne 400 si le statut est invalide", async () => {
    const req = { params: { applicationId: "app-1" }, userId: "uuid-1", body: { status: "INVALID" } };
    const res = mockRes();
    await applicationsController.updateApplicationStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "status invalide" });
  });

  it("retourne 404 si la candidature n'existe pas", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const req = { params: { applicationId: "app-404" }, userId: "uuid-1", body: { status: "WITHDRAWN" } };
    const res = mockRes();
    await applicationsController.updateApplicationStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it("retourne 403 si l'utilisateur n'est ni candidat ni propriétaire", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: "app-1", listing_id: "l-1", applicant_user_id: "uuid-applicant", status: "SENT" }] })
      .mockResolvedValueOnce({ rows: [{ owner_user_id: "uuid-owner" }] });

    const req = { params: { applicationId: "app-1" }, userId: "uuid-stranger", body: { status: "WITHDRAWN" } };
    const res = mockRes();
    await applicationsController.updateApplicationStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("le candidat peut retirer sa candidature (WITHDRAWN) depuis SENT", async () => {
    const updated = { id: "app-1", status: "WITHDRAWN" };
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: "app-1", listing_id: "l-1", applicant_user_id: "uuid-applicant", status: "SENT" }] })
      .mockResolvedValueOnce({ rows: [{ owner_user_id: "uuid-owner" }] })
      .mockResolvedValueOnce({ rows: [updated] });

    const req = { params: { applicationId: "app-1" }, userId: "uuid-applicant", body: { status: "WITHDRAWN" } };
    const res = mockRes();
    await applicationsController.updateApplicationStatus(req, res);

    expect(res.json).toHaveBeenCalledWith({ application: updated });
  });

  it("le candidat ne peut pas mettre un statut ACCEPTED", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: "app-1", listing_id: "l-1", applicant_user_id: "uuid-applicant", status: "SENT" }] })
      .mockResolvedValueOnce({ rows: [{ owner_user_id: "uuid-owner" }] });

    const req = { params: { applicationId: "app-1" }, userId: "uuid-applicant", body: { status: "ACCEPTED" } };
    const res = mockRes();
    await applicationsController.updateApplicationStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("le propriétaire peut accepter une candidature (ACCEPTED)", async () => {
    const updated = { id: "app-1", status: "ACCEPTED" };
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: "app-1", listing_id: "l-1", applicant_user_id: "uuid-applicant", status: "SENT" }] })
      .mockResolvedValueOnce({ rows: [{ owner_user_id: "uuid-owner" }] })
      .mockResolvedValueOnce({ rows: [updated] });

    const req = { params: { applicationId: "app-1" }, userId: "uuid-owner", body: { status: "ACCEPTED" } };
    const res = mockRes();
    await applicationsController.updateApplicationStatus(req, res);

    expect(res.json).toHaveBeenCalledWith({ application: updated });
  });

  it("le propriétaire peut rejeter une candidature (REJECTED)", async () => {
    const updated = { id: "app-1", status: "REJECTED" };
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: "app-1", listing_id: "l-1", applicant_user_id: "uuid-applicant", status: "SENT" }] })
      .mockResolvedValueOnce({ rows: [{ owner_user_id: "uuid-owner" }] })
      .mockResolvedValueOnce({ rows: [updated] });

    const req = { params: { applicationId: "app-1" }, userId: "uuid-owner", body: { status: "REJECTED" } };
    const res = mockRes();
    await applicationsController.updateApplicationStatus(req, res);

    expect(res.json).toHaveBeenCalledWith({ application: updated });
  });

  it("retourne 400 si candidature déjà traitée (statut non SENT) pour le propriétaire", async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ id: "app-1", listing_id: "l-1", applicant_user_id: "uuid-applicant", status: "ACCEPTED" }] })
      .mockResolvedValueOnce({ rows: [{ owner_user_id: "uuid-owner" }] });

    const req = { params: { applicationId: "app-1" }, userId: "uuid-owner", body: { status: "REJECTED" } };
    const res = mockRes();
    await applicationsController.updateApplicationStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Candidature deja traitee" });
  });
});
