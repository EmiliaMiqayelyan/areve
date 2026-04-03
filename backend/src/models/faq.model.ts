import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

export class Faq extends Model {}

Faq.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    question: { type: DataTypes.STRING(400), allowNull: false },
    answer: { type: DataTypes.TEXT, allowNull: false },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: "sort_order" },
  },
  { sequelize, tableName: "faqs", underscored: true, timestamps: false }
);
