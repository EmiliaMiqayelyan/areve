import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

export class OrderItem extends Model {}

OrderItem.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    orderId: { type: DataTypes.STRING(64), allowNull: false, field: "order_id" },
    productId: { type: DataTypes.STRING(64), allowNull: false, field: "product_id" },
    productName: { type: DataTypes.STRING(120), allowNull: false, field: "product_name" },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false, field: "unit_price" },
    unitCost: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0, field: "unit_cost" },
  },
  { sequelize, tableName: "order_items", underscored: true, timestamps: false }
);
