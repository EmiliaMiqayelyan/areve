"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = getHealth;
exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.getReviews = getReviews;
exports.getFaqs = getFaqs;
exports.getGallery = getGallery;
exports.createContact = createContact;
exports.createOrder = createOrder;
const crypto_1 = require("crypto");
const models_1 = require("../models");
async function getHealth(req, res) {
    return res.json({ status: "ok" });
}
async function getProducts(req, res) {
    const where = req.query.active === "true" ? { status: "active" } : undefined;
    const rows = await models_1.Product.findAll({ where, order: [["createdAt", "DESC"]] });
    return res.json(rows);
}
async function getProductById(req, res) {
    const id = String(req.params.id);
    const row = await models_1.Product.findByPk(id);
    if (!row)
        return res.status(404).json({ message: "Product not found" });
    return res.json(row);
}
async function getReviews(req, res) {
    const rows = await models_1.Review.findAll({ where: { status: "approved" }, order: [["createdAt", "DESC"]] });
    return res.json(rows);
}
async function getFaqs(req, res) {
    const rows = await models_1.Faq.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] });
    return res.json(rows);
}
async function getGallery(req, res) {
    const rows = await models_1.Gallery.findAll({ order: [["createdAt", "DESC"]] });
    return res.json(rows);
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
    const total = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
        await models_1.OrderItem.create({
            id: (0, crypto_1.randomUUID)(),
            orderId: id,
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
        });
    }
    return res.status(201).json({ id, message: "Order placed successfully" });
}
