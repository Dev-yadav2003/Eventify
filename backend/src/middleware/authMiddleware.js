import jwt from "jsonwebtoken";
import { findUserById } from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    return next(new Error("Not authorized."));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await findUserById(decoded.id);

    if (!req.user) {
      res.status(401);
      return next(new Error("User not found."));
    }

    return next();
  } catch (error) {
    res.status(401);
    return next(new Error("Invalid token."));
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    throw new Error("Forbidden.");
  }

  next();
};
