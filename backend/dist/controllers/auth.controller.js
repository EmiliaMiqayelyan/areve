"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = loginAdmin;
exports.getAdminAccount = getAdminAccount;
exports.updateAdminCredentials = updateAdminCredentials;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const models_1 = require("../models");
async function loginAdmin(req, res) {
    const { email, password } = req.body;
    const admin = await models_1.Admin.findOne({ where: { email } });
    if (!admin)
        return res.status(401).json({ message: "Invalid credentials" });
    const isValid = await bcryptjs_1.default.compare(password, admin.get("passwordHash"));
    if (!isValid)
        return res.status(401).json({ message: "Invalid credentials" });
    const token = jsonwebtoken_1.default.sign({
        id: admin.get("id"),
        email: admin.get("email"),
        role: admin.get("role"),
        name: admin.get("name"),
    }, env_1.env.jwtSecret, { expiresIn: "12h" });
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
async function getAdminAccount(req, res) {
    const adminId = req.admin?.id;
    if (!adminId)
        return res.status(401).json({ message: "Unauthorized" });
    const admin = await models_1.Admin.findByPk(adminId, {
        attributes: ["id", "name", "email", "role"],
    });
    if (!admin)
        return res.status(404).json({ message: "Admin not found" });
    return res.json({
        id: admin.get("id"),
        name: admin.get("name"),
        email: admin.get("email"),
        role: admin.get("role"),
    });
}
async function updateAdminCredentials(req, res) {
    const adminId = req.admin?.id;
    if (!adminId)
        return res.status(401).json({ message: "Unauthorized" });
    const { currentPassword, newEmail, newPassword } = req.body;
    const admin = await models_1.Admin.findByPk(adminId);
    if (!admin)
        return res.status(404).json({ message: "Admin not found" });
    const isValid = await bcryptjs_1.default.compare(currentPassword, admin.get("passwordHash"));
    if (!isValid)
        return res.status(401).json({ message: "Current password is incorrect" });
    const nextEmail = newEmail?.trim();
    const updates = {};
    if (nextEmail && nextEmail !== admin.get("email")) {
        const existing = await models_1.Admin.findOne({ where: { email: nextEmail } });
        if (existing)
            return res.status(409).json({ message: "Email is already in use" });
        updates.email = nextEmail;
    }
    if (newPassword) {
        updates.passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
    }
    if (!updates.email && !updates.passwordHash) {
        return res.status(400).json({ message: "Nothing to update" });
    }
    await admin.update(updates);
    const email = updates.email ?? admin.get("email");
    const token = jsonwebtoken_1.default.sign({
        id: admin.get("id"),
        email,
        role: admin.get("role"),
        name: admin.get("name"),
    }, env_1.env.jwtSecret, { expiresIn: "12h" });
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
