import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize";

export class Setting extends Model {}

Setting.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    storeName: { type: DataTypes.STRING(120), allowNull: false, field: "store_name" },
    tagline: { type: DataTypes.STRING(240), allowNull: false },
    footerDescription: { type: DataTypes.TEXT, allowNull: false, field: "footer_description" },
    supportEmail: { type: DataTypes.STRING(160), allowNull: false, field: "support_email" },
    businessPhone: { type: DataTypes.STRING(50), allowNull: false, field: "business_phone" },
    address: { type: DataTypes.STRING(255), allowNull: false },
    instagramUrl: { type: DataTypes.STRING(255), allowNull: false, field: "instagram_url" },
    facebookUrl: { type: DataTypes.STRING(255), allowNull: false, field: "facebook_url" },
    whatsappUrl: { type: DataTypes.STRING(255), allowNull: false, field: "whatsapp_url" },
    tiktokUrl: { type: DataTypes.STRING(255), allowNull: false, defaultValue: "", field: "tiktok_url" },
    youtubeUrl: { type: DataTypes.STRING(255), allowNull: false, defaultValue: "", field: "youtube_url" },
    siteContent: { type: DataTypes.JSON, allowNull: true, field: "site_content" },
  },
  { sequelize, tableName: "settings", underscored: true, timestamps: false }
);
