const { randomUUID } = require("crypto");
const pool = require("../config/db");
const PUBLIC_BASE_URL = (process.env.PUBLIC_BASE_URL || "http://localhost:3002").replace(/\/+$/, "");

const ALLOWED_STATUSES = new Set(["DRAFT", "PUBLISHED", "PAUSED", "CLOSED"]);
const ALLOWED_HOUSING_TYPES = new Set(["ROOM", "STUDIO", "FLAT", "HOUSE", "OTHER"]);

const parseIntOrNull = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
};

const parseDateOrNull = (value) => {
  if (value === undefined || value === null || value === "") return null;
  return value;
};

const parseBooleanLike = (value) => {
  if (value === true || value === false) return value;
  if (typeof value === "string") {
    return ["true", "1", "yes", "on"].includes(value.toLowerCase());
  }
  return Boolean(value);
};

const buildPublicPhotoUrl = (filename) => `${PUBLIC_BASE_URL}/uploads/${encodeURIComponent(filename)}`;

const collectListingPhotos = (req) => {
  const uploadedPhotos = Array.isArray(req.files)
    ? req.files.map((file) => buildPublicPhotoUrl(file.filename))
    : [];

  const bodyPhotos = Array.isArray(req.body.photos)
    ? req.body.photos
    : typeof req.body.photos === "string"
      ? req.body.photos
          .split("\n")
          .map((url) => url.trim())
          .filter((url) => url.length > 0)
      : [];

  const textPhotoUrls = typeof req.body.photo_urls === "string"
    ? req.body.photo_urls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
    : [];

  return [...uploadedPhotos, ...bodyPhotos, ...textPhotoUrls];
};

const writeListingPhotos = async (client, listingId, photos) => {
  const cleanPhotos = (Array.isArray(photos) ? photos : [])
    .filter((url) => typeof url === "string" && url.trim() !== "")
    .map((url, index) => ({ url: url.trim(), sortOrder: index }));

  await client.query("DELETE FROM listing_photos WHERE listing_id = $1", [listingId]);

  if (cleanPhotos.length === 0) {
    return;
  }

  const photoValues = [];
  const photoParams = [];
  let paramIndex = 1;

  cleanPhotos.forEach(({ url, sortOrder }) => {
    photoValues.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
    photoParams.push(randomUUID(), listingId, url, sortOrder);
  });

  await client.query(
    `INSERT INTO listing_photos (id, listing_id, url, sort_order) VALUES ${photoValues.join(", ")}`,
    photoParams,
  );
};

exports.listListings = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
    const offset = Math.max(parseInt(req.query.offset || "0", 10), 0);

    const where = [];
    const params = [];

    // Default to published listings for public browsing.
    const status = (req.query.status || "PUBLISHED").toUpperCase();
    if (status && ALLOWED_STATUSES.has(status)) {
      params.push(status);
      where.push(`l.status = $${params.length}`);
    }

    const city = (req.query.city || "").trim();
    if (city) {
      params.push(city);
      where.push(`loc.city = $${params.length}`);
    }

    const postalCode = (req.query.postal_code || "").trim();
    if (postalCode) {
      params.push(postalCode);
      where.push(`loc.postal_code = $${params.length}`);
    }

    const minRent = parseIntOrNull(req.query.min_rent);
    if (minRent !== null) {
      params.push(minRent);
      where.push(`l.rent_amount >= $${params.length}`);
    }

    const maxRent = parseIntOrNull(req.query.max_rent);
    if (maxRent !== null) {
      params.push(maxRent);
      where.push(`l.rent_amount <= $${params.length}`);
    }

    params.push(limit, offset);
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const result = await pool.query(
      `SELECT
        l.id,
        l.owner_user_id,
        l.location_id,
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
        l.created_at,
        l.updated_at,
        loc.city,
        loc.postal_code,
        loc.address,
        loc.lat,
        loc.lng,
        lp.url AS photo_url
      FROM listings l
      JOIN locations loc ON loc.id = l.location_id
      LEFT JOIN LATERAL (
        SELECT url
        FROM listing_photos
        WHERE listing_id = l.id
        ORDER BY sort_order ASC, created_at ASC
        LIMIT 1
      ) lp ON TRUE
      ${whereSql}
      ORDER BY l.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    return res.json({ listings: result.rows, limit, offset });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listingId = req.params.id;

    const listingResult = await pool.query(
      `SELECT
        l.*,
        loc.city,
        loc.postal_code,
        loc.address,
        loc.lat,
        loc.lng
      FROM listings l
      JOIN locations loc ON loc.id = l.location_id
      WHERE l.id = $1`,
      [listingId],
    );

    if (listingResult.rows.length === 0) {
      return res.status(404).json({ message: "Annonce introuvable" });
    }

    const photosResult = await pool.query(
      "SELECT id, url, sort_order, created_at FROM listing_photos WHERE listing_id = $1 ORDER BY sort_order ASC",
      [listingId],
    );

    return res.json({ listing: listingResult.rows[0], photos: photosResult.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.createListing = async (req, res) => {
  const client = await pool.connect();
  try {
    const ownerUserId = req.userId;

    const title = (req.body.title || "").trim();
    const description = (req.body.description || "").trim();
    const rentAmount = parseIntOrNull(req.body.rent_amount);
    const chargesIncluded = parseBooleanLike(req.body.charges_included);
    const surfaceM2 = parseIntOrNull(req.body.surface_m2);
    const housingType = (req.body.housing_type || "").toUpperCase();
    const availableFrom = req.body.available_from;
    const availableTo = parseDateOrNull(req.body.available_to);
    const minDurationMonths = parseIntOrNull(req.body.min_duration_months);

    const status = (req.body.status || "DRAFT").toUpperCase();

    const city = (req.body.location?.city || req.body.city || "").trim();
    const postalCode = (req.body.location?.postal_code || req.body.postal_code || "").trim();
    const address = (req.body.location?.address || req.body.address || null) ?? null;
    const lat = req.body.location?.lat ?? req.body.lat ?? null;
    const lng = req.body.location?.lng ?? req.body.lng ?? null;
    const photos = collectListingPhotos(req);

    if (!title || !description || rentAmount === null || !availableFrom) {
      return res.status(400).json({
        message: "Champs requis: title, description, rent_amount, available_from",
      });
    }
    if (!city || !postalCode) {
      return res.status(400).json({ message: "Champs location requis: city, postal_code" });
    }
    if (!ALLOWED_HOUSING_TYPES.has(housingType)) {
      return res.status(400).json({ message: "housing_type invalide" });
    }
    if (!ALLOWED_STATUSES.has(status)) {
      return res.status(400).json({ message: "status invalide" });
    }

    const locationId = randomUUID();
    const listingId = randomUUID();

    await client.query("BEGIN");

    await client.query(
      "INSERT INTO locations (id, city, postal_code, address, lat, lng) VALUES ($1,$2,$3,$4,$5,$6)",
      [locationId, city, postalCode, address, lat, lng],
    );

    const listingResult = await client.query(
      `INSERT INTO listings (
        id, owner_user_id, location_id, title, description, rent_amount, charges_included,
        surface_m2, housing_type, available_from, available_to, min_duration_months, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *`,
      [
        listingId,
        ownerUserId,
        locationId,
        title,
        description,
        rentAmount,
        chargesIncluded,
        surfaceM2,
        housingType,
        availableFrom,
        availableTo,
        minDurationMonths,
        status,
      ],
    );

    await writeListingPhotos(client, listingId, photos);

    await client.query("COMMIT");

    return res.status(201).json({ listing: listingResult.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23514") {
      return res.status(400).json({ message: "Donnees invalides" });
    }
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  } finally {
    client.release();
  }
};

exports.updateListing = async (req, res) => {
  let client;
  try {
    const listingId = req.params.id;
    const userId = req.userId;

    const existing = await pool.query(
      "SELECT id, owner_user_id FROM listings WHERE id = $1",
      [listingId],
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Annonce introuvable" });
    }
    if (existing.rows[0].owner_user_id !== userId) {
      return res.status(403).json({ message: "Interdit" });
    }

    const photos = Object.prototype.hasOwnProperty.call(req.body, "photos") || Array.isArray(req.files) || typeof req.body.photo_urls === "string"
      ? collectListingPhotos(req)
      : null;

    const allowed = {
      title: (v) => (v || "").trim(),
      description: (v) => (v || "").trim(),
      rent_amount: (v) => parseIntOrNull(v),
      charges_included: (v) => parseBooleanLike(v),
      surface_m2: (v) => parseIntOrNull(v),
      housing_type: (v) => (v || "").toUpperCase(),
      available_from: (v) => v,
      available_to: (v) => (v === "" ? null : v),
      min_duration_months: (v) => parseIntOrNull(v),
      status: (v) => (v || "").toUpperCase(),
    };

    const sets = [];
    const params = [];
    for (const [key, transform] of Object.entries(allowed)) {
      if (!Object.prototype.hasOwnProperty.call(req.body, key)) continue;
      const value = transform(req.body[key]);

      if (key === "housing_type" && value && !ALLOWED_HOUSING_TYPES.has(value)) {
        return res.status(400).json({ message: "housing_type invalide" });
      }
      if (key === "status" && value && !ALLOWED_STATUSES.has(value)) {
        return res.status(400).json({ message: "status invalide" });
      }
      if (key === "rent_amount" && value === null) {
        return res.status(400).json({ message: "rent_amount invalide" });
      }

      params.push(value);
      sets.push(`${key} = $${params.length}`);
    }

    if (sets.length === 0 && photos === null) {
      return res.status(400).json({ message: "Aucun champ a modifier" });
    }

    client = await pool.connect();
    await client.query("BEGIN");

    let listing = existing.rows[0];
    if (sets.length > 0) {
      params.push(listingId);
      const result = await client.query(
        `UPDATE listings SET ${sets.join(", ")} WHERE id = $${params.length} RETURNING *`,
        params,
      );
      listing = result.rows[0];
    }

    if (photos !== null) {
      await writeListingPhotos(client, listingId, photos);
      if (sets.length === 0) {
        const refreshed = await client.query(
          "SELECT * FROM listings WHERE id = $1",
          [listingId],
        );
        listing = refreshed.rows[0];
      }
    }

    await client.query("COMMIT");

    return res.json({ listing });
  } catch (err) {
    if (client) {
      await client.query("ROLLBACK");
    }
    if (err.code === "23514") {
      return res.status(400).json({ message: "Donnees invalides" });
    }
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  } finally {
    if (client) {
      client.release();
    }
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listingId = req.params.id;
    const userId = req.userId;

    const existing = await pool.query(
      "SELECT id, owner_user_id FROM listings WHERE id = $1",
      [listingId],
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Annonce introuvable" });
    }
    if (existing.rows[0].owner_user_id !== userId) {
      return res.status(403).json({ message: "Interdit" });
    }

    await pool.query("DELETE FROM listings WHERE id = $1", [listingId]);
    return res.json({ message: "Annonce supprimee" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.searchByLocation = async (req, res) => {
  // Alias endpoint used by the gateway README (filters are handled by listListings).
  return exports.listListings(req, res);
};

