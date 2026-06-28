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

export async function getAdminAccount(req: Request, res: Response) {
  const adminId = req.admin?.id;
  if (!adminId) return res.status(401).json({ message: "Unauthorized" });

  const admin = await Admin.findByPk(adminId, {
    attributes: ["id", "name", "email", "role"],
  });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  return res.json({
    id: admin.get("id"),
    name: admin.get("name"),
    email: admin.get("email"),
    role: admin.get("role"),
  });
}

export async function updateAdminCredentials(req: Request, res: Response) {
  const adminId = req.admin?.id;
  if (!adminId) return res.status(401).json({ message: "Unauthorized" });

  const { currentPassword, newEmail, newPassword } = req.body as {
    currentPassword: string;
    newEmail?: string;
    newPassword?: string;
  };

  const admin = await Admin.findByPk(adminId);
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const isValid = await bcrypt.compare(currentPassword, admin.get("passwordHash") as string);
  if (!isValid) return res.status(401).json({ message: "Current password is incorrect" });

  const nextEmail = newEmail?.trim();
  const updates: { email?: string; passwordHash?: string } = {};

  if (nextEmail && nextEmail !== admin.get("email")) {
    const existing = await Admin.findOne({ where: { email: nextEmail } });
    if (existing) return res.status(409).json({ message: "Email is already in use" });
    updates.email = nextEmail;
  }

  if (newPassword) {
    updates.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  if (!updates.email && !updates.passwordHash) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  await admin.update(updates);

  const email = updates.email ?? (admin.get("email") as string);
  const token = jwt.sign(
    {
      id: admin.get("id"),
      email,
      role: admin.get("role"),
      name: admin.get("name"),
    },
    env.jwtSecret,
    { expiresIn: "12h" }
  );

  return res.json({
    message: "Credentials updated",
    token,
    admin: {
      id: admin.get("id"),
      email,
      role: admin.get("role"),
      name: admin.get("name"),
    },
  });
}
