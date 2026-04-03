import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/sequelize";

interface AdminAttributes {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}
type AdminCreation = Optional<AdminAttributes, "role">;

export class Admin extends Model<AdminAttributes, AdminCreation> implements AdminAttributes {
  declare id: string;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare role: string;
}

Admin.init(
  {
    id: { type: DataTypes.STRING(64), primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false, field: "password_hash" },
    role: { type: DataTypes.STRING(30), allowNull: false, defaultValue: "admin" },
  },
  { sequelize, tableName: "admins", underscored: true, timestamps: true, updatedAt: false }
);
