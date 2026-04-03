import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

export class Contact extends Model {}

Contact.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
  },
  { sequelize, tableName: "contacts", underscored: true, timestamps: true, updatedAt: false }
);
