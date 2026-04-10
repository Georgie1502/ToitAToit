const { errorHandler, asyncHandler } = require("../middleware/errorHandler");

const mockReq = (path = "/test", method = "GET") => ({ path, method });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ─────────────────────────────────────────────
// errorHandler
// ─────────────────────────────────────────────
describe("errorHandler", () => {
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.NODE_ENV;
  });

  it("retourne 503 pour une erreur ECONNREFUSED (service indisponible)", () => {
    const err = { code: "ECONNREFUSED", message: "Connection refused", stack: "" };
    const req = mockReq();
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Service temporairement indisponible" })
    );
  });

  it("retourne 504 pour une erreur ETIMEDOUT", () => {
    const err = { code: "ETIMEDOUT", message: "Timeout", stack: "" };
    const req = mockReq();
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(504);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: expect.stringContaining("trop de temps") })
    );
  });

  it("retourne 504 pour une erreur ESOCKETTIMEDOUT", () => {
    const err = { code: "ESOCKETTIMEDOUT", message: "Socket timeout", stack: "" };
    const req = mockReq();
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(504);
  });

  it("retourne le status de l'erreur si défini", () => {
    const err = { status: 422, message: "Unprocessable Entity", stack: "" };
    const req = mockReq();
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Unprocessable Entity" })
    );
  });

  it("retourne 500 par défaut pour une erreur générique", () => {
    const err = { message: "Something went wrong", stack: "stack trace" };
    const req = mockReq();
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("inclut le stack en mode development", () => {
    process.env.NODE_ENV = "development";
    const err = { message: "Error", stack: "trace line 1" };
    const req = mockReq();
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ stack: "trace line 1" })
    );
  });

  it("n'inclut pas le stack hors mode development", () => {
    process.env.NODE_ENV = "production";
    const err = { message: "Error", stack: "trace line 1" };
    const req = mockReq();
    const res = mockRes();

    errorHandler(err, req, res, next);

    const jsonCall = res.json.mock.calls[0][0];
    expect(jsonCall).not.toHaveProperty("stack");
  });
});

// ─────────────────────────────────────────────
// asyncHandler
// ─────────────────────────────────────────────
describe("asyncHandler", () => {
  it("appelle next() avec l'erreur si la promesse est rejetée", async () => {
    const error = new Error("async error");
    const fn = jest.fn().mockRejectedValue(error);
    const req = mockReq();
    const res = mockRes();
    const next = jest.fn();

    await asyncHandler(fn)(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("exécute la fonction sans erreur si la promesse est résolue", async () => {
    const fn = jest.fn().mockResolvedValue("ok");
    const req = mockReq();
    const res = mockRes();
    const next = jest.fn();

    await asyncHandler(fn)(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });
});
