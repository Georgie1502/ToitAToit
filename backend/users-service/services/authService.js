const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateToken } = require("../utils/tokenUtils");

// Auth Service
class AuthService {
  async signup({ email, username, password }) {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      passwordHash: hashedPassword,
    });
    delete user.password_hash;
    const token = generateToken(user.id);
    return { user, token };
  }
  async login({ email, password }) {
    const user = await User.findByEmail(email);
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
