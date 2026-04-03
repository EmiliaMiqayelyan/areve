import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

export class Product extends Model { }

Product.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    // Stores data URLs from the current admin upload UI.
    // Must be large enough; otherwise the data URL is truncated and images won't render.
    image: { type: DataTypes.TEXT('medium'), allowNull: false },
    category: { type: DataTypes.ENUM("bags", "toys", "accessories"), allowNull: false },
    badge: { type: DataTypes.STRING(40), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM("active", "inactive"), allowNull: false, defaultValue: "active" },
  },
  { sequelize, tableName: "products", underscored: true, timestamps: true, updatedAt: false }
);
