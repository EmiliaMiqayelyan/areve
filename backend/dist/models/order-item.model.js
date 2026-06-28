"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItem = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../config/sequelize");
class OrderItem extends sequelize_1.Model {
}
exports.OrderItem = OrderItem;
OrderItem.init({
    id: { type: sequelize_1.DataTypes.STRING(64), primaryKey: true },
    orderId: { type: sequelize_1.DataTypes.STRING(64), allowNull: false, field: "order_id" },
    productId: { type: sequelize_1.DataTypes.STRING(64), allowNull: false, field: "product_id" },
    productName: { type: sequelize_1.DataTypes.STRING(120), allowNull: false, field: "product_name" },
    quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    unitPrice: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false, field: "unit_price" },
    unitCost: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0, field: "unit_cost" },
}, { sequelize: sequelize_2.sequelize, tableName: "order_items", underscored: true, timestamps: false });
