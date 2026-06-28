"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../config/sequelize");
class Product extends sequelize_1.Model {
}
exports.Product = Product;
Product.init({
    id: { type: sequelize_1.DataTypes.STRING(64), primaryKey: true },
    name: { type: sequelize_1.DataTypes.JSON, allowNull: false },
    price: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    // Stores data URLs from the current admin upload UI.
    // Must be large enough; otherwise the data URL is truncated and images won't render.
    image: { type: sequelize_1.DataTypes.TEXT('medium'), allowNull: false },
    category: { type: sequelize_1.DataTypes.STRING(64), allowNull: false },
    cost: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    badge: { type: sequelize_1.DataTypes.JSON, allowNull: true },
    description: { type: sequelize_1.DataTypes.JSON, allowNull: true },
    status: { type: sequelize_1.DataTypes.ENUM("active", "inactive"), allowNull: false, defaultValue: "active" },
}, { sequelize: sequelize_2.sequelize, tableName: "products", underscored: true, timestamps: true, updatedAt: false });
