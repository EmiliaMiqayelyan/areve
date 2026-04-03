import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

export class Review extends Model {}

Review.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    location: { type: DataTypes.STRING(120), allowNull: true },
    product: { type: DataTypes.STRING(120), allowNull: false },
    rating: { type: DataTypes.TINYINT, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM("approved", "pending", "rejected"), allowNull: false, defaultValue: "pending" },
  },
  { sequelize, tableName: "reviews", underscored: true, timestamps: true, updatedAt: false }
);
