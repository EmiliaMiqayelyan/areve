import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

export class Faq extends Model {}

Faq.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    question: { type: DataTypes.JSON, allowNull: false },
    answer: { type: DataTypes.JSON, allowNull: false },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: "sort_order" },
  },
  { sequelize, tableName: "faqs", underscored: true, timestamps: false }
);
