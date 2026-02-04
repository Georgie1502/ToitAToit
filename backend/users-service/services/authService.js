const bcrypt = require("bcrypt");
const { randomUUID } = require("crypto");
const User = require("../models/User");
const { generateToken } = require("../utils/tokenUtils");

const normalizeEmail = (email) => (email || "").trim().toLowerCase();
const normalizeUsername = (username) => (username || "").trim();

// Auth Service
class AuthService {
  async signup({ email, username, password }) {
    const normalizedEmail = normalizeEmail(email);
    const normalizedUsername = normalizeUsername(username);

    const existingUser = await User.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = randomUUID();
    const user = await User.create({
      id: userId,
      email: normalizedEmail,
      username: normalizedUsername,
      passwordHash: hashedPassword,
    });
    // password_hash is not selected in create(), but keep it safe anyway.
    delete user.password_hash;
    const token = generateToken(user.id);
    return { user, token };
  }
  async login({ email, password }) {
    const normalizedEmail = normalizeEmail(email);
    const user = await User.findByEmail(normalizedEmail);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    delete user.password_hash;
    const token = generateToken(user.id);
    return { user, token };
  }
}
module.exports = new AuthService();
