import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

export class Category extends Model {}

Category.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    name: { type: DataTypes.JSON, allowNull: false },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: "sort_order" },
  },
  { sequelize, tableName: "categories", underscored: true, timestamps: false }
);
