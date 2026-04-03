"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = loginAdmin;
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
