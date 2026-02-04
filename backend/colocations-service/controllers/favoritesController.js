const pool = require("../config/db");

exports.listMyFavorites = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
    const offset = Math.max(parseInt(req.query.offset || "0", 10), 0);

    const result = await pool.query(
      `SELECT
        f.created_at AS favorited_at,
        l.id AS listing_id,
        l.owner_user_id,
        l.title,
        l.description,
        l.rent_amount,
        l.charges_included,
        l.surface_m2,
        l.housing_type,
        l.available_from,
        l.available_to,
        l.min_duration_months,
        l.status,
        l.created_at AS listing_created_at,
        l.updated_at AS listing_updated_at,
        loc.id AS location_id,
        loc.city,
        loc.postal_code,
        loc.address,
        loc.lat,
        loc.lng
      FROM favorites f
      JOIN listings l ON l.id = f.listing_id
      JOIN locations loc ON loc.id = l.location_id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );

    return res.json({ favorites: result.rows, limit, offset });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.userId;
    const listingId = req.params.id;

    const exists = await pool.query("SELECT 1 FROM listings WHERE id = $1", [
      listingId,
    ]);
    if (exists.rows.length === 0) {
      return res.status(404).json({ message: "Annonce introuvable" });
    }

    await pool.query(
      "INSERT INTO favorites (user_id, listing_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [userId, listingId],
    );

    return res.status(201).json({ message: "Ajoute aux favoris" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.userId;
    const listingId = req.params.id;

    await pool.query("DELETE FROM favorites WHERE user_id = $1 AND listing_id = $2", [
      userId,
      listingId,
    ]);

    return res.json({ message: "Retire des favoris" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

