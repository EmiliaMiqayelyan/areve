"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminProducts = getAdminProducts;
exports.createAdminProduct = createAdminProduct;
exports.updateAdminProduct = updateAdminProduct;
exports.deleteAdminProduct = deleteAdminProduct;
exports.getAdminReviews = getAdminReviews;
exports.createAdminReview = createAdminReview;
exports.updateAdminReview = updateAdminReview;
exports.deleteAdminReview = deleteAdminReview;
exports.getAdminOrders = getAdminOrders;
exports.getAdminOrderById = getAdminOrderById;
exports.updateAdminOrderStatus = updateAdminOrderStatus;
exports.getAdminFaqs = getAdminFaqs;
exports.replaceAdminFaqs = replaceAdminFaqs;
exports.getAdminGallery = getAdminGallery;
exports.createAdminGallery = createAdminGallery;
exports.deleteAdminGallery = deleteAdminGallery;
exports.getAdminSettings = getAdminSettings;
exports.updateAdminSettings = updateAdminSettings;
exports.getAdminUsers = getAdminUsers;
const crypto_1 = require("crypto");
const models_1 = require("../models");
async function getAdminProducts(req, res) {
    return res.json(await models_1.Product.findAll({ order: [["createdAt", "DESC"]] }));
}
async function createAdminProduct(req, res) {
    const row = await models_1.Product.create({ id: (0, crypto_1.randomUUID)(), ...req.body });
    return res.status(201).json({ id: row.get("id") });
}
async function updateAdminProduct(req, res) {
    await models_1.Product.update(req.body, { where: { id: req.params.id } });
    return res.json({ message: "Product updated" });
}
async function deleteAdminProduct(req, res) {
    await models_1.Product.destroy({ where: { id: req.params.id } });
    return res.json({ message: "Product deleted" });
}
async function getAdminReviews(req, res) {
    return res.json(await models_1.Review.findAll({ order: [["createdAt", "DESC"]] }));
}
async function createAdminReview(req, res) {
    const row = await models_1.Review.create({ id: (0, crypto_1.randomUUID)(), ...req.body });
    return res.status(201).json({ id: row.get("id") });
}
async function updateAdminReview(req, res) {
    await models_1.Review.update(req.body, { where: { id: req.params.id } });
    return res.json({ message: "Review updated" });
}
async function deleteAdminReview(req, res) {
    await models_1.Review.destroy({ where: { id: req.params.id } });
    return res.json({ message: "Review deleted" });
}
async function getAdminOrders(req, res) {
    return res.json(await models_1.Order.findAll({ order: [["createdAt", "DESC"]] }));
}
async function getAdminOrderById(req, res) {
    const id = String(req.params.id);
    const row = await models_1.Order.findByPk(id);
    if (!row)
        return res.status(404).json({ message: "Order not found" });
    const items = await models_1.OrderItem.findAll({ where: { orderId: id } });
    return res.json({ ...row.toJSON(), items });
}
async function updateAdminOrderStatus(req, res) {
    await models_1.Order.update({ status: req.body.status }, { where: { id: req.params.id } });
    return res.json({ message: "Order status updated" });
}
async function getAdminFaqs(req, res) {
    return res.json(await models_1.Faq.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] }));
}
async function replaceAdminFaqs(req, res) {
    const list = req.body;
    await models_1.Faq.destroy({ where: {} });
    for (const [index, faq] of list.entries()) {
        await models_1.Faq.create({ id: (0, crypto_1.randomUUID)(), question: faq.question, answer: faq.answer, sortOrder: index });
    }
    return res.json({ message: "FAQs updated" });
}
async function getAdminGallery(req, res) {
    return res.json(await models_1.Gallery.findAll({ order: [["createdAt", "DESC"]] }));
}
async function createAdminGallery(req, res) {
    const row = await models_1.Gallery.create({ id: (0, crypto_1.randomUUID)(), ...req.body });
    return res.status(201).json({ id: row.get("id") });
}
async function deleteAdminGallery(req, res) {
    await models_1.Gallery.destroy({ where: { id: req.params.id } });
    return res.json({ message: "Gallery image deleted" });
}
async function getAdminSettings(req, res) {
    return res.json(await models_1.Setting.findByPk(1));
}
async function updateAdminSettings(req, res) {
    await models_1.Setting.update(req.body, { where: { id: 1 } });
    return res.json({ message: "Settings updated" });
}
async function getAdminUsers(req, res) {
    return res.json(await models_1.Admin.findAll({
        attributes: ["id", "name", "email", "role", "createdAt"],
        order: [["createdAt", "DESC"]],
    }));
}
