"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../config/sequelize");
class Review extends sequelize_1.Model {
}
exports.Review = Review;
Review.init({
    id: { type: sequelize_1.DataTypes.STRING(64), primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING(120), allowNull: false },
    location: { type: sequelize_1.DataTypes.STRING(120), allowNull: true },
    product: { type: sequelize_1.DataTypes.STRING(120), allowNull: false },
    rating: { type: sequelize_1.DataTypes.TINYINT, allowNull: false },
    comment: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    status: { type: sequelize_1.DataTypes.ENUM("approved", "pending", "rejected"), allowNull: false, defaultValue: "pending" },
}, { sequelize: sequelize_2.sequelize, tableName: "reviews", underscored: true, timestamps: true, updatedAt: false });
