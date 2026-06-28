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
const models_1 = require("../models");
const mergeSiteContent_1 = require("../utils/mergeSiteContent");
const serializers_1 = require("../utils/serializers");
async function getHealth(_req, res) {
    return res.json({ status: "ok" });
}
async function getPublicSettings(_req, res) {
    const row = await models_1.Setting.findByPk(1);
    if (!row)
        return res.status(404).json({ message: "Settings not found" });
    const j = row.toJSON();
    const siteContent = (0, mergeSiteContent_1.mergeSiteContent)(j.siteContent ?? j.site_content);
    return res.json({
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
        siteContent,
    });
}
async function getProducts(req, res) {
    const locale = (0, serializers_1.resolveRequestLocale)(req);
    const where = req.query.active === "true" ? { status: "active" } : undefined;
    const rows = await models_1.Product.findAll({ where, order: [["createdAt", "DESC"]] });
    return res.json(rows.map((row) => (0, serializers_1.formatProduct)(row, { locale })));
}
async function getProductById(req, res) {
    const locale = (0, serializers_1.resolveRequestLocale)(req);
    const id = String(req.params.id);
    const row = await models_1.Product.findByPk(id);
    if (!row)
        return res.status(404).json({ message: "Product not found" });
    return res.json((0, serializers_1.formatProduct)(row, { locale }));
}
async function getReviews(req, res) {
    const locale = (0, serializers_1.resolveRequestLocale)(req);
    const rows = await models_1.Review.findAll({
        where: { status: "approved" },
        order: [["createdAt", "DESC"]],
    });
    return res.json(rows.map((row) => (0, serializers_1.formatReview)(row, { locale })));
}
async function getFaqs(req, res) {
    const locale = (0, serializers_1.resolveRequestLocale)(req);
    const rows = await models_1.Faq.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] });
    return res.json(rows.map((row) => (0, serializers_1.formatFaq)(row.toJSON(), { locale })));
}
async function getGallery(req, res) {
    const locale = (0, serializers_1.resolveRequestLocale)(req);
    const rows = await models_1.Gallery.findAll({ order: [["createdAt", "DESC"]] });
    return res.json(rows.map((row) => (0, serializers_1.formatGalleryItem)(row, { locale })));
}
async function getCategories(req, res) {
    const locale = (0, serializers_1.resolveRequestLocale)(req);
    const rows = await models_1.Category.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] });
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
