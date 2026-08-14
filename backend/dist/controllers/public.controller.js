"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = getHealth;
exports.getPublicSettings = getPublicSettings;
exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.getReviews = getReviews;
exports.getFaqs = getFaqs;
exports.getGallery = getGallery;
exports.getCategories = getCategories;
exports.createContact = createContact;
exports.createOrder = createOrder;
const crypto_1 = require("crypto");
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const publicCache_1 = require("../utils/publicCache");
const serializers_1 = require("../utils/serializers");
const resourceId_1 = require("../utils/resourceId");
const PUBLIC_LIST_ATTRIBUTES = [
    "id",
    "name",
    "price",
    "image",
    "category",
    "badge",
    "status",
    "isFavorite",
    "sortOrder",
    "createdAt",
];
const PUBLIC_DETAIL_ATTRIBUTES = [...PUBLIC_LIST_ATTRIBUTES, "description"];
function setPublicCache(res, maxAge = 60) {
    res.setHeader("Cache-Control", `public, max-age=${maxAge}, stale-while-revalidate=${maxAge * 5}`);
    res.setHeader("Vary", "Origin, Accept-Language");
}
function parsePositiveInt(value, fallback, max) {
    const n = Number.parseInt(String(value ?? ""), 10);
    if (!Number.isFinite(n) || n < 1)
        return fallback;
    return Math.min(n, max);
}
async function getHealth(_req, res) {
    return res.json({ status: "ok" });
}
async function getPublicSettings(_req, res) {
    const cached = (0, publicCache_1.getCachedPublicSettings)();
    if (cached) {
        setPublicCache(res, 120);
        return res.json(cached);
    }
    const row = await models_1.Setting.findByPk(1, {
        attributes: [
            "storeName",
            "tagline",
            "footerDescription",
            "supportEmail",
            "businessPhone",
            "address",
            "instagramUrl",
            "facebookUrl",
            "whatsappUrl",
            "telegramUrl",
            "tiktokUrl",
            "youtubeUrl",
        ],
    });
    if (!row)
        return res.status(404).json({ message: "Settings not found" });
    const j = row.toJSON();
    const payload = {
        storeName: j.storeName ?? j.store_name,
        tagline: j.tagline,
        footerDescription: j.footerDescription ?? j.footer_description,
        supportEmail: j.supportEmail ?? j.support_email,
        businessPhone: j.businessPhone ?? j.business_phone,
        address: j.address,
        instagramUrl: j.instagramUrl ?? j.instagram_url,
        facebookUrl: j.facebookUrl ?? j.facebook_url,
        whatsappUrl: j.whatsappUrl ?? j.whatsapp_url,
        telegramUrl: j.telegramUrl ?? j.telegram_url ?? "",
        tiktokUrl: j.tiktokUrl ?? j.tiktok_url ?? "",
        youtubeUrl: j.youtubeUrl ?? j.youtube_url ?? "",
    };
    (0, publicCache_1.setCachedPublicSettings)(payload);
    setPublicCache(res, 120);
    return res.json(payload);
}
async function getProducts(req, res) {
    const locale = (0, serializers_1.resolveRequestLocale)(req);
    const where = {};
    if (req.query.active === "true")
        where.status = "active";
    if (req.query.favorite === "true")
        where.isFavorite = true;
    const category = String(req.query.category ?? "").trim();
    if (category && category !== "all")
        where.category = category;
    const excludeId = (0, resourceId_1.normalizeResourceId)(String(req.query.excludeId ?? "").trim());
    if (excludeId)
        where.id = { [sequelize_1.Op.ne]: excludeId };
    const limit = parsePositiveInt(req.query.limit, 0, 100);
    const page = parsePositiveInt(req.query.page, 1, 1000);
    const offset = limit > 0 ? (page - 1) * limit : undefined;
    const rows = await models_1.Product.findAll({
        attributes: [...PUBLIC_LIST_ATTRIBUTES],
        where: Object.keys(where).length ? where : undefined,
        order: [["sortOrder", "ASC"], ["createdAt", "DESC"]],
        ...(limit > 0 ? { limit, offset } : {}),
    });
    setPublicCache(res, 60);
    return res.json(rows.map((row) => (0, serializers_1.formatProduct)(row, { locale, list: true })));
}
async function getProductById(req, res) {
    const locale = (0, serializers_1.resolveRequestLocale)(req);
    const id = (0, resourceId_1.normalizeResourceId)(String(req.params.id));
    const row = await models_1.Product.findByPk(id, { attributes: [...PUBLIC_DETAIL_ATTRIBUTES] });
    if (!row)
        return res.status(404).json({ message: "Product not found" });
    setPublicCache(res, 120);
    return res.json((0, serializers_1.formatProduct)(row, { locale }));
}
async function getReviews(req, res) {
    const locale = (0, serializers_1.resolveRequestLocale)(req);
    const rows = await models_1.Review.findAll({
        where: { status: "approved" },
        order: [["createdAt", "DESC"]],
    });
    setPublicCache(res, 120);
    return res.json(rows.map((row) => (0, serializers_1.formatReview)(row, { locale })));
}
async function getFaqs(req, res) {
    const locale = (0, serializers_1.resolveRequestLocale)(req);
    const rows = await models_1.Faq.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] });
    setPublicCache(res, 300);
    return res.json(rows.map((row) => (0, serializers_1.formatFaq)(row.toJSON(), { locale })));
}
async function getGallery(req, res) {
    const locale = (0, serializers_1.resolveRequestLocale)(req);
    const limit = parsePositiveInt(req.query.limit, 0, 50);
    const rows = await models_1.Gallery.findAll({
        order: [["sortOrder", "ASC"], ["createdAt", "DESC"]],
        ...(limit > 0 ? { limit } : {}),
    });
    setPublicCache(res, 120);
    return res.json(rows.map((row) => (0, serializers_1.formatGalleryItem)(row, { locale })));
}
async function getCategories(req, res) {
    const locale = (0, serializers_1.resolveRequestLocale)(req);
    const rows = await models_1.Category.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] });
    setPublicCache(res, 300);
    return res.json(rows.map((row) => (0, serializers_1.formatCategory)(row.toJSON(), { locale })));
}
async function createContact(req, res) {
    const id = (0, crypto_1.randomUUID)();
    await models_1.Contact.create({ id, ...req.body });
    return res.status(201).json({ id, message: "Inquiry received" });
}
async function createOrder(req, res) {
    const body = req.body;
    const id = `ORD-${Date.now()}`;
    const fullName = `${body.firstName} ${body.lastName}`.trim();
    const total = body.items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    await models_1.Order.create({
        id,
        customerName: fullName,
        customerEmail: body.email,
        total,
        status: "pending",
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
    });
    for (const item of body.items) {
        const product = await models_1.Product.findByPk(String(item.id));
        const unitCost = product ? Number(product.toJSON().cost ?? 0) : 0;
        await models_1.OrderItem.create({
            id: (0, crypto_1.randomUUID)(),
            orderId: id,
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            unitCost,
        });
    }
    return res.status(201).json({ id, message: "Order placed successfully" });
}
