const pool = require("../config/db");
const User = require("../models/User");

exports.listUsers = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
    const offset = Math.max(parseInt(req.query.offset || "0", 10), 0);
    const users = await User.findAll({ limit, offset });
    return res.json({ users, limit, offset });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.userId !== id) {
      return res.status(403).json({ message: "Interdit" });
    }
    const username = (req.body.username || "").trim();
    if (!username) {
      return res.status(400).json({ message: "username requis" });
    }
    const user = await User.updateUsername(id, { username });
    return res.json({ user });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Nom d'utilisateur deja utilise" });
    }
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.userId !== id) {
      return res.status(403).json({ message: "Interdit" });
    }
    const user = await User.softDeleteById(id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await pool.query(
      `SELECT
        u.id AS user_id,
        u.username,
        u.email,
        u.status AS user_status,
        u.created_at AS user_created_at,
        u.updated_at AS user_updated_at,
        p.user_id AS profile_user_id,
        p.birth_date,
        p.gender,
        p.occupation_status,
        p.bio,
        p.created_at AS profile_created_at,
        p.updated_at AS profile_updated_at,
        pref.user_id AS preferences_user_id,
        pref.budget_min,
        pref.budget_max,
        pref.location,
        pref.smoking,
        pref.pets,
        pref.noise_level,
        pref.guests_policy,
        pref.lifestyle_notes,
        pref.updated_at AS preferences_updated_at
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      LEFT JOIN profile_preferences pref ON pref.user_id = u.id
      WHERE u.id = $1`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const row = result.rows[0];
    const profile =
      row.profile_user_id === null
        ? null
        : {
            birth_date: row.birth_date,
            gender: row.gender,
            occupation_status: row.occupation_status,
            bio: row.bio,
            created_at: row.profile_created_at,
            updated_at: row.profile_updated_at,
          };

    const preferences =
      row.preferences_user_id === null
        ? null
        : {
            budget_min: row.budget_min,
            budget_max: row.budget_max,
            location: row.location,
            smoking: row.smoking,
            pets: row.pets,
            noise_level: row.noise_level,
            guests_policy: row.guests_policy,
            lifestyle_notes: row.lifestyle_notes,
            updated_at: row.preferences_updated_at,
          };

    return res.json({
      user: {
        id: row.user_id,
        username: row.username,
        email: row.email,
        status: row.user_status,
        created_at: row.user_created_at,
        updated_at: row.user_updated_at,
      },
      profile,
      preferences,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.upsertMyProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const birthDate = req.body.birth_date || null;
    const gender = req.body.gender || null;
    const occupationStatus = req.body.occupation_status || null;
    const bio = req.body.bio || null;

    const result = await pool.query(
      `INSERT INTO profiles (user_id, birth_date, gender, occupation_status, bio)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id) DO UPDATE
      SET birth_date = EXCLUDED.birth_date,
          gender = EXCLUDED.gender,
          occupation_status = EXCLUDED.occupation_status,
          bio = EXCLUDED.bio
      RETURNING user_id, birth_date, gender, occupation_status, bio, created_at, updated_at`,
      [userId, birthDate, gender, occupationStatus, bio],
    );

    return res.json({ profile: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

// Simple batch endpoint to avoid N+1 calls when the gateway needs user info.
exports.batchUsers = async (req, res) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    if (ids.length === 0) {
      return res.status(400).json({ message: "ids[] requis" });
    }
    if (ids.length > 200) {
      return res.status(400).json({ message: "Trop d'ids (max 200)" });
    }
    const result = await pool.query(
      "SELECT id, username, email, status FROM users WHERE id = ANY($1::uuid[])",
      [ids],
    );
    return res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

