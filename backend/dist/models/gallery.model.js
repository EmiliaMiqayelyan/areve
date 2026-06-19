"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gallery = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../config/sequelize");
class Gallery extends sequelize_1.Model {
}
exports.Gallery = Gallery;
Gallery.init({
    id: { type: sequelize_1.DataTypes.STRING(64), primaryKey: true },
    // Stores data URLs from the current admin gallery upload UI.
    // Must be large enough; otherwise the data URL is truncated and images won't render.
    src: { type: sequelize_1.DataTypes.TEXT('medium'), allowNull: false },
    alt: { type: sequelize_1.DataTypes.JSON, allowNull: false },
    cols: { type: sequelize_1.DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
}, { sequelize: sequelize_2.sequelize, tableName: "gallery", underscored: true, timestamps: true, updatedAt: false });
