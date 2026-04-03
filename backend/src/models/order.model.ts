import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

export class Order extends Model {}

Order.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    customerName: { type: DataTypes.STRING(160), allowNull: false, field: "customer_name" },
    customerEmail: { type: DataTypes.STRING(160), allowNull: false, field: "customer_email" },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    status: { type: DataTypes.ENUM("pending", "shipped", "delivered"), allowNull: false, defaultValue: "pending" },
    address: { type: DataTypes.STRING(255), allowNull: false },
    city: { type: DataTypes.STRING(100), allowNull: false },
    state: { type: DataTypes.STRING(100), allowNull: false },
    zipCode: { type: DataTypes.STRING(30), allowNull: false, field: "zip_code" },
  },
  { sequelize, tableName: "orders", underscored: true, timestamps: true, updatedAt: false }
);
