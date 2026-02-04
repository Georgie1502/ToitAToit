const bcrypt = require("bcrypt");
const { randomUUID } = require("crypto");
const pool = require("../config/db");
const { generateToken } = require("../utils/tokenUtils");

const normalizeEmail = (email) => (email || "").trim().toLowerCase();
const normalizeUsername = (username) => (username || "").trim();

exports.signup = async (req, res) => {
  try {
    const username = normalizeUsername(req.body.username);
    const email = normalizeEmail(req.body.email);
    const password = req.body.password;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email et password sont requis",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = randomUUID();

    await pool.query(
      "INSERT INTO users (id, username, email, password_hash) VALUES ($1, $2, $3, $4)",
      [userId, username, email, hashedPassword],
    );

    const token = generateToken(userId);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      // Keep this aligned with JWT_EXPIRES_IN (defaults to 24h in .env).
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.status(201).json({
      message: "Utilisateur inscrit avec succes",
      user: { id: userId, username, email },
      token,
    });
  } catch (err) {
    if (err.code === "23505") {
      const constraint = err.constraint || "";
      if (constraint.includes("users_username") || constraint.includes("username")) {
        return res.status(409).json({ message: "Nom d'utilisateur deja utilise" });
      }
      if (constraint.includes("users_email") || constraint.includes("email")) {
        return res.status(409).json({ message: "Email deja utilise" });
      }
      return res.status(409).json({ message: "Utilisateur deja existant" });
    }

    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const result = await pool.query(
      "SELECT id, username, email, password_hash, status FROM users WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const user = result.rows[0];
    if (user.status === "DELETED") {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = generateToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.json({
      message: "Connexion reussie",
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.json({ message: "Deconnexion reussie" });
};
