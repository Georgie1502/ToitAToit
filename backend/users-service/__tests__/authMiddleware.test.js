const authMiddleware = require("../middleware/authMiddleware");

jest.mock("../utils/tokenUtils", () => ({
  verifyToken: jest.fn(),
}));

const { verifyToken } = require("../utils/tokenUtils");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("authMiddleware", () => {
  beforeEach(() => jest.clearAllMocks());

  it("retourne 401 si aucun token fourni", () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "No token provided" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("retourne 403 si token invalide", () => {
    verifyToken.mockImplementation(() => { throw new Error("invalid"); });

    const req = { headers: { authorization: "Bearer bad-token" } };
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Invalid token" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("accepte un token valide via Authorization header et appelle next()", () => {
    verifyToken.mockReturnValue({ userId: "uuid-42" });

    const req = { headers: { authorization: "Bearer valid-token" } };
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(req.userId).toBe("uuid-42");
    expect(next).toHaveBeenCalled();
  });

  it("accepte un token valide via cookie et appelle next()", () => {
    verifyToken.mockReturnValue({ userId: "uuid-99" });

    const req = { headers: { cookie: "token=valid-cookie-token" } };
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith("valid-cookie-token");
    expect(req.userId).toBe("uuid-99");
    expect(next).toHaveBeenCalled();
  });

  it("préfère le token du header Authorization sur le cookie", () => {
    verifyToken.mockReturnValue({ userId: "from-header" });

    const req = {
      headers: {
        authorization: "Bearer header-token",
        cookie: "token=cookie-token",
      },
    };
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(verifyToken).toHaveBeenCalledWith("header-token");
    expect(req.userId).toBe("from-header");
  });
});
