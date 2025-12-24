import jwt from "jsonwebtoken";
import { config } from "..//../config/config.js";

export const login = (req, res) => {
  const { username, password } = req.body;

  if (username !== "admin" && password !== "password") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ owner: true }, config.jwtsecret, {
    expiresIn: "7d",
  });

  res.json({ token });
};
