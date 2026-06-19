"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setting = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../config/sequelize");
class Setting extends sequelize_1.Model {
}
exports.Setting = Setting;
Setting.init({
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true },
    storeName: { type: sequelize_1.DataTypes.STRING(120), allowNull: false, field: "store_name" },
    tagline: { type: sequelize_1.DataTypes.STRING(240), allowNull: false },
    footerDescription: { type: sequelize_1.DataTypes.TEXT, allowNull: false, field: "footer_description" },
    supportEmail: { type: sequelize_1.DataTypes.STRING(160), allowNull: false, field: "support_email" },
    businessPhone: { type: sequelize_1.DataTypes.STRING(50), allowNull: false, field: "business_phone" },
    address: { type: sequelize_1.DataTypes.STRING(255), allowNull: false },
    instagramUrl: { type: sequelize_1.DataTypes.STRING(255), allowNull: false, field: "instagram_url" },
    facebookUrl: { type: sequelize_1.DataTypes.STRING(255), allowNull: false, field: "facebook_url" },
    whatsappUrl: { type: sequelize_1.DataTypes.STRING(255), allowNull: false, field: "whatsapp_url" },
    tiktokUrl: { type: sequelize_1.DataTypes.STRING(255), allowNull: false, defaultValue: "", field: "tiktok_url" },
    youtubeUrl: { type: sequelize_1.DataTypes.STRING(255), allowNull: false, defaultValue: "", field: "youtube_url" },
    siteContent: { type: sequelize_1.DataTypes.JSON, allowNull: true, field: "site_content" },
}, { sequelize: sequelize_2.sequelize, tableName: "settings", underscored: true, timestamps: false });
