const pool = require("../config/db");

const normalizeEmail = (email) => (email || "").trim().toLowerCase();

// User Model
class User {
  static async findByEmail(email) {
    const normalized = normalizeEmail(email);
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      normalized,
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      "SELECT id, email, username, status, created_at, updated_at FROM users WHERE id = $1",
      [id],
    );
    return result.rows[0];
  }

  static async create({ id, email, username, passwordHash }) {
    const normalized = normalizeEmail(email);
    const result = await pool.query(
      "INSERT INTO users (id, email, username, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, email, username, status, created_at, updated_at",
      [id, normalized, username, passwordHash],
    );
    return result.rows[0];
  }

  static async findAll({ limit = 50, offset = 0 } = {}) {
    const result = await pool.query(
      "SELECT id, email, username, status, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset],
    );
    return result.rows;
  }

  static async updateUsername(id, { username }) {
    const result = await pool.query(
      "UPDATE users SET username = $1 WHERE id = $2 RETURNING id, email, username, status, created_at, updated_at",
      [username, id],
    );
    return result.rows[0];
  }

  static async softDeleteById(id) {
    const result = await pool.query(
      "UPDATE users SET status = 'DELETED' WHERE id = $1 RETURNING id, email, username, status, created_at, updated_at",
      [id],
    );
    return result.rows[0];
  }
}

module.exports = User;

