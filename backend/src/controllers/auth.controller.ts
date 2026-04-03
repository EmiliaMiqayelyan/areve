import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Admin } from "../models";

export async function loginAdmin(req: Request, res: Response) {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ where: { email } });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, admin.get("passwordHash") as string);
  if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    {
      id: admin.get("id"),
      email: admin.get("email"),
      role: admin.get("role"),
      name: admin.get("name"),
    },
    env.jwtSecret,
    { expiresIn: "12h" }
  );
  return res.json({
    token,
    admin: {
      id: admin.get("id"),
      email: admin.get("email"),
      role: admin.get("role"),
      name: admin.get("name"),
    },
  });
}
