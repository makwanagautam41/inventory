import jwt from "jsonwebtoken";
import { config } from "../../config/config.js";

export const login = (req, res) => {
  const { username, password } = req.body;

  if (username !== "admin" || password !== "admin123") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ owner: true }, config.jwtSecret, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Login successful" });
};
