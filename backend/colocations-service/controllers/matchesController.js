const { randomUUID } = require("crypto");
const pool = require("../config/db");

const ALLOWED_STATUSES = new Set(["SUGGESTED", "LIKED", "DISLIKED", "MUTUAL"]);

const parseIntOrNull = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
};

exports.listMyMatches = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
    const offset = Math.max(parseInt(req.query.offset || "0", 10), 0);

    const result = await pool.query(
      `SELECT
        m.id,
        m.listing_id,
        m.user_id,
        m.score,
        m.status,
        m.created_at,
        l.owner_user_id,
        l.title,
        l.rent_amount,
        l.status AS listing_status,
        loc.city,
        loc.postal_code
      FROM matches m
      JOIN listings l ON l.id = m.listing_id
      JOIN locations loc ON loc.id = l.location_id
      WHERE m.user_id = $1
      ORDER BY m.created_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );

    return res.json({ matches: result.rows, limit, offset });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getMyMatchForListing = async (req, res) => {
  try {
    const userId = req.userId;
    const listingId = req.params.id;

    const result = await pool.query(
      "SELECT id, listing_id, user_id, score, status, created_at FROM matches WHERE listing_id = $1 AND user_id = $2",
      [listingId, userId],
    );

    return res.json({ match: result.rows[0] || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.upsertMyMatchForListing = async (req, res) => {
  try {
    const userId = req.userId;
    const listingId = req.params.id;
    const status = (req.body.status || "SUGGESTED").toUpperCase();
    const score = parseIntOrNull(req.body.score);

    if (!ALLOWED_STATUSES.has(status)) {
      return res.status(400).json({ message: "status invalide" });
    }
    if (score !== null && score < 0) {
      return res.status(400).json({ message: "score invalide" });
    }

    const exists = await pool.query("SELECT 1 FROM listings WHERE id = $1", [
      listingId,
    ]);
    if (exists.rows.length === 0) {
      return res.status(404).json({ message: "Annonce introuvable" });
    }

    const matchId = randomUUID();
    const result = await pool.query(
      `INSERT INTO matches (id, listing_id, user_id, score, status)
      VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT (listing_id, user_id) DO UPDATE
      SET score = EXCLUDED.score, status = EXCLUDED.status
      RETURNING id, listing_id, user_id, score, status, created_at`,
      [matchId, listingId, userId, score, status],
    );

    return res.json({ match: result.rows[0] });
  } catch (err) {
    if (err.code === "23514") {
      return res.status(400).json({ message: "Donnees invalides" });
    }
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.deleteMyMatchForListing = async (req, res) => {
  try {
    const userId = req.userId;
    const listingId = req.params.id;

    await pool.query("DELETE FROM matches WHERE listing_id = $1 AND user_id = $2", [
      listingId,
      userId,
    ]);

    return res.json({ message: "Match supprime" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

