"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../config/sequelize");
class Category extends sequelize_1.Model {
}
exports.Category = Category;
Category.init({
    id: { type: sequelize_1.DataTypes.STRING(64), primaryKey: true },
    name: { type: sequelize_1.DataTypes.JSON, allowNull: false },
    sortOrder: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: "sort_order" },
}, { sequelize: sequelize_2.sequelize, tableName: "categories", underscored: true, timestamps: false });
