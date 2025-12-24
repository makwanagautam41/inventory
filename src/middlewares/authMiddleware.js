import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, config.jwtSecret, (err) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    next();
  });
};
