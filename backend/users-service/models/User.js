const pool = require("../config/db");

// User Model
class User {
  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }
  static async findById(id) {
    const result = await pool.query(
      "SELECT id, email, username FROM users WHERE id = $1",
      [id],
    );
    return result.rows[0];
  }
  static async create({ email, username, passwordHash }) {
    const result = await pool.query(
      "INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username",
      [email, username, passwordHash],
    );
    return result.rows[0];
  }
  static async findAll() {
    const result = await pool.query("SELECT id, email, username FROM users");
    return result.rows;
  }

  static async deleteById(id) {
    const result = await pool.query(
      "UPDATE users SET username = $1, age = $2, gender = $3 WHERE id = $4 RETURNING *",
      [username, id],
    );
    return result.rows[0];
  }
  static async update(id, { username }) {
    const result = await pool.query(
      "UPDATE users SET username = $1 WHERE id = $2 RETURNING id, email, username",
      [username, id],
    );
    return result.rows[0];
  }
}
module.exports = User;
