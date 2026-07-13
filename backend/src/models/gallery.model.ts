import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

export class Gallery extends Model {}

Gallery.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    // Stores data URLs from the current admin gallery upload UI.
    // Must be large enough; otherwise the data URL is truncated and images won't render.
    src: { type: DataTypes.TEXT('medium'), allowNull: false },
    alt: { type: DataTypes.JSON, allowNull: false },
    cols: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: "sort_order" },
  },
  { sequelize, tableName: "gallery", underscored: true, timestamps: true, updatedAt: false }
);
