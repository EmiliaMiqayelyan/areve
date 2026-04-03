import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing admin token" });

  try {
    req.admin = jwt.verify(token, env.jwtSecret) as Request["admin"];
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
