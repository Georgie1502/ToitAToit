const { randomUUID } = require("crypto");
const pool = require("../config/db");

const ALLOWED_STATUSES = new Set(["SENT", "ACCEPTED", "REJECTED", "WITHDRAWN"]);

exports.listMyApplications = async (req, res) => {
  try {
    const userId = req.userId;
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
    const offset = Math.max(parseInt(req.query.offset || "0", 10), 0);

    const result = await pool.query(
      `SELECT
        a.id,
        a.listing_id,
        a.applicant_user_id,
        a.message,
        a.status,
        a.created_at,
        a.updated_at,
        l.owner_user_id,
        l.title,
        l.rent_amount,
        l.status AS listing_status,
        loc.city,
        loc.postal_code
      FROM applications a
      JOIN listings l ON l.id = a.listing_id
      JOIN locations loc ON loc.id = l.location_id
      WHERE a.applicant_user_id = $1
      ORDER BY a.created_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );

    return res.json({ applications: result.rows, limit, offset });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.listApplicationsForListing = async (req, res) => {
  try {
    const listingId = req.params.id;
    const userId = req.userId;

    const listing = await pool.query(
      "SELECT id, owner_user_id FROM listings WHERE id = $1",
      [listingId],
    );
    if (listing.rows.length === 0) {
      return res.status(404).json({ message: "Annonce introuvable" });
    }
    if (listing.rows[0].owner_user_id !== userId) {
      return res.status(403).json({ message: "Interdit" });
    }

    const result = await pool.query(
      `SELECT id, listing_id, applicant_user_id, message, status, created_at, updated_at
      FROM applications
      WHERE listing_id = $1
      ORDER BY created_at DESC`,
      [listingId],
    );

    return res.json({ listing_id: listingId, applications: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.applyToListing = async (req, res) => {
  try {
    const listingId = req.params.id;
    const userId = req.userId;
    const message = (req.body.message || "").trim() || null;

    const listing = await pool.query(
      "SELECT id, owner_user_id, status FROM listings WHERE id = $1",
      [listingId],
    );
    if (listing.rows.length === 0) {
      return res.status(404).json({ message: "Annonce introuvable" });
    }
    if (listing.rows[0].owner_user_id === userId) {
      return res.status(400).json({ message: "Tu ne peux pas candidater a ta propre annonce" });
    }

    const existing = await pool.query(
      "SELECT id, status FROM applications WHERE listing_id = $1 AND applicant_user_id = $2",
      [listingId, userId],
    );

    if (existing.rows.length > 0) {
      const current = existing.rows[0];
      if (current.status !== "WITHDRAWN") {
        return res.status(409).json({ message: "Candidature deja envoyee" });
      }

      const updated = await pool.query(
        `UPDATE applications
        SET status = 'SENT', message = $1
        WHERE id = $2
        RETURNING id, listing_id, applicant_user_id, message, status, created_at, updated_at`,
        [message, current.id],
      );
      return res.json({ application: updated.rows[0] });
    }

    const applicationId = randomUUID();
    const result = await pool.query(
      `INSERT INTO applications (id, listing_id, applicant_user_id, message, status)
      VALUES ($1,$2,$3,$4,'SENT')
      RETURNING id, listing_id, applicant_user_id, message, status, created_at, updated_at`,
      [applicationId, listingId, userId, message],
    );

    return res.status(201).json({ application: result.rows[0] });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Candidature deja envoyee" });
    }
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const userId = req.userId;

    const newStatus = (req.body.status || "").toUpperCase();
    if (!ALLOWED_STATUSES.has(newStatus)) {
      return res.status(400).json({ message: "status invalide" });
    }

    const appResult = await pool.query(
      "SELECT id, listing_id, applicant_user_id, status FROM applications WHERE id = $1",
      [applicationId],
    );
    if (appResult.rows.length === 0) {
      return res.status(404).json({ message: "Candidature introuvable" });
    }
    const application = appResult.rows[0];

    const listing = await pool.query(
      "SELECT owner_user_id FROM listings WHERE id = $1",
      [application.listing_id],
    );
    if (listing.rows.length === 0) {
      return res.status(404).json({ message: "Annonce introuvable" });
    }
    const ownerUserId = listing.rows[0].owner_user_id;

    const isApplicant = userId === application.applicant_user_id;
    const isOwner = userId === ownerUserId;

    if (!isApplicant && !isOwner) {
      return res.status(403).json({ message: "Interdit" });
    }

    // Applicant can only withdraw (and only from SENT).
    if (isApplicant) {
      if (newStatus !== "WITHDRAWN") {
        return res.status(403).json({ message: "Interdit" });
      }
      if (application.status !== "SENT") {
        return res.status(400).json({ message: "Impossible de retirer cette candidature" });
      }
    }

    // Owner can accept/reject (only from SENT).
    if (isOwner && !isApplicant) {
      if (newStatus !== "ACCEPTED" && newStatus !== "REJECTED") {
        return res.status(403).json({ message: "Interdit" });
      }
      if (application.status !== "SENT") {
        return res.status(400).json({ message: "Candidature deja traitee" });
      }
    }

    const result = await pool.query(
      `UPDATE applications
      SET status = $1
      WHERE id = $2
      RETURNING id, listing_id, applicant_user_id, message, status, created_at, updated_at`,
      [newStatus, applicationId],
    );

    return res.json({ application: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

