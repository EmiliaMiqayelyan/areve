"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../config/sequelize");
class Contact extends sequelize_1.Model {
}
exports.Contact = Contact;
Contact.init({
    id: { type: sequelize_1.DataTypes.STRING(64), primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING(120), allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING(160), allowNull: false },
    message: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
}, { sequelize: sequelize_2.sequelize, tableName: "contacts", underscored: true, timestamps: true, updatedAt: false });
