"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../config/sequelize");
class Admin extends sequelize_1.Model {
}
exports.Admin = Admin;
Admin.init({
    id: { type: sequelize_1.DataTypes.STRING(64), primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING(120), allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING(160), allowNull: false, unique: true },
    passwordHash: { type: sequelize_1.DataTypes.STRING(255), allowNull: false, field: "password_hash" },
    role: { type: sequelize_1.DataTypes.STRING(30), allowNull: false, defaultValue: "admin" },
}, { sequelize: sequelize_2.sequelize, tableName: "admins", underscored: true, timestamps: true, updatedAt: false });
