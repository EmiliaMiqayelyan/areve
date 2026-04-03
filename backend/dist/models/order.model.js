"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../config/sequelize");
class Order extends sequelize_1.Model {
}
exports.Order = Order;
Order.init({
    id: { type: sequelize_1.DataTypes.STRING(64), primaryKey: true },
    customerName: { type: sequelize_1.DataTypes.STRING(160), allowNull: false, field: "customer_name" },
    customerEmail: { type: sequelize_1.DataTypes.STRING(160), allowNull: false, field: "customer_email" },
    total: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: sequelize_1.DataTypes.ENUM("pending", "shipped", "delivered"), allowNull: false, defaultValue: "pending" },
    address: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
    city: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    state: { type: sequelize_1.DataTypes.STRING(100), allowNull: false },
    zipCode: { type: sequelize_1.DataTypes.STRING(30), allowNull: false, field: "zip_code" },
}, { sequelize: sequelize_2.sequelize, tableName: "orders", underscored: true, timestamps: true, updatedAt: false });
