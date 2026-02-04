const pool = require("../config/db");

exports.getMyPreferences = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT user_id, budget_min, budget_max, location, smoking, pets, noise_level, guests_policy, lifestyle_notes, updated_at FROM profile_preferences WHERE user_id = $1",
      [req.userId],
    );
    return res.json({ preferences: result.rows[0] || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.upsertMyPreferences = async (req, res) => {
  try {
    const userId = req.userId;
    const budgetMin = req.body.budget_min ?? null;
    const budgetMax = req.body.budget_max ?? null;
    const location = req.body.location ?? null;
    const smoking = req.body.smoking ?? null;
    const pets = req.body.pets ?? null;
    const noiseLevel = req.body.noise_level ?? null;
    const guestsPolicy = req.body.guests_policy ?? null;
    const lifestyleNotes = req.body.lifestyle_notes ?? null;

    const result = await pool.query(
      `INSERT INTO profile_preferences (
        user_id, budget_min, budget_max, location, smoking, pets, noise_level, guests_policy, lifestyle_notes
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (user_id) DO UPDATE
      SET budget_min = EXCLUDED.budget_min,
          budget_max = EXCLUDED.budget_max,
          location = EXCLUDED.location,
          smoking = EXCLUDED.smoking,
          pets = EXCLUDED.pets,
          noise_level = EXCLUDED.noise_level,
          guests_policy = EXCLUDED.guests_policy,
          lifestyle_notes = EXCLUDED.lifestyle_notes
      RETURNING user_id, budget_min, budget_max, location, smoking, pets, noise_level, guests_policy, lifestyle_notes, updated_at`,
      [
        userId,
        budgetMin,
        budgetMax,
        location,
        smoking,
        pets,
        noiseLevel,
        guestsPolicy,
        lifestyleNotes,
      ],
    );

    return res.json({ preferences: result.rows[0] });
  } catch (err) {
    if (err.code === "23514") {
      // CHECK constraint violation (e.g. budget_min <= budget_max, enum values)
      return res.status(400).json({ message: "Preferences invalides" });
    }
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.deleteMyPreferences = async (req, res) => {
  try {
    await pool.query("DELETE FROM profile_preferences WHERE user_id = $1", [
      req.userId,
    ]);
    return res.json({ message: "Preferences supprimees" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

