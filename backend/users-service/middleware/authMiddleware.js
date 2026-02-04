const { verifyToken } = require("../utils/tokenUtils");

const getCookieValue = (cookieHeader, name) => {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((p) => p.trim());
  const found = parts.find((p) => p.startsWith(`${name}=`));
  if (!found) return null;
  return decodeURIComponent(found.slice(name.length + 1));
};

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const headerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;
    const cookieToken = getCookieValue(req.headers.cookie, "token");
    const token = headerToken || cookieToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid token" }); 
  }
};

module.exports = authMiddleware;
