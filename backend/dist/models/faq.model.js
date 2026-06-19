"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faq = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../config/sequelize");
class Faq extends sequelize_1.Model {
}
exports.Faq = Faq;
Faq.init({
    id: { type: sequelize_1.DataTypes.STRING(64), primaryKey: true },
    question: { type: sequelize_1.DataTypes.JSON, allowNull: false },
    answer: { type: sequelize_1.DataTypes.JSON, allowNull: false },
    sortOrder: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: "sort_order" },
}, { sequelize: sequelize_2.sequelize, tableName: "faqs", underscored: true, timestamps: false });
