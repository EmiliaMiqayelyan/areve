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
exports.updateAdminOrder = updateAdminOrder;
exports.deleteAdminOrder = deleteAdminOrder;
exports.createAdminOrder = createAdminOrder;
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
const mergeSiteContent_1 = require("../utils/mergeSiteContent");
const serializers_1 = require("../utils/serializers");
const ORDER_PATCH_FIELDS = [
    "customerName",
    "customerEmail",
    "address",
    "city",
    "state",
    "zipCode",
    "status",
    "total",
];
function pickOrderPatch(body) {
    const patch = {};
    for (const key of ORDER_PATCH_FIELDS) {
        if (body[key] !== undefined)
            patch[key] = body[key];
    }
    return patch;
}
async function getAdminProducts(_req, res) {
    const rows = await models_1.Product.findAll({ order: [["createdAt", "DESC"]] });
    return res.json(rows.map((row) => (0, serializers_1.formatProduct)(row, { bilingual: true })));
}
async function createAdminProduct(req, res) {
    const { id: clientId, ...data } = req.body;
    const id = typeof clientId === "string" && clientId.trim() ? clientId.trim() : (0, crypto_1.randomUUID)();
    const row = await models_1.Product.create({ id, ...data });
    return res.status(201).json((0, serializers_1.formatProduct)(row, { bilingual: true }));
}
async function updateAdminProduct(req, res) {
    const id = String(req.params.id);
    if (!Object.keys(req.body).length) {
        return res.status(400).json({ message: "No fields to update" });
    }
    const [affected] = await models_1.Product.update(req.body, { where: { id } });
    if (!affected)
        return res.status(404).json({ message: "Product not found" });
    const row = await models_1.Product.findByPk(id);
    return res.json({
        message: "Product updated",
        product: row ? (0, serializers_1.formatProduct)(row, { bilingual: true }) : null,
    });
}
async function deleteAdminProduct(req, res) {
    const id = String(req.params.id);
    const deleted = await models_1.Product.destroy({ where: { id } });
    if (!deleted)
        return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Product deleted" });
}
async function getAdminReviews(_req, res) {
    const rows = await models_1.Review.findAll({ order: [["createdAt", "DESC"]] });
    return res.json(rows.map((row) => (0, serializers_1.formatReview)(row, { bilingual: true })));
}
async function createAdminReview(req, res) {
    const { id: clientId, ...data } = req.body;
    const id = typeof clientId === "string" && clientId.trim() ? clientId.trim() : (0, crypto_1.randomUUID)();
    const row = await models_1.Review.create({ id, ...data });
    return res.status(201).json((0, serializers_1.formatReview)(row, { bilingual: true }));
}
async function updateAdminReview(req, res) {
    const id = String(req.params.id);
    if (!Object.keys(req.body).length) {
        return res.status(400).json({ message: "No fields to update" });
    }
    const [affected] = await models_1.Review.update(req.body, { where: { id } });
    if (!affected)
        return res.status(404).json({ message: "Review not found" });
    return res.json({ message: "Review updated" });
}
async function deleteAdminReview(req, res) {
    const id = String(req.params.id);
    const deleted = await models_1.Review.destroy({ where: { id } });
    if (!deleted)
        return res.status(404).json({ message: "Review not found" });
    return res.json({ message: "Review deleted" });
}
async function getAdminOrders(_req, res) {
    const rows = await models_1.Order.findAll({
        order: [["createdAt", "DESC"]],
        include: [{ model: models_1.OrderItem, as: "items", required: false }],
    });
    return res.json(rows.map(serializers_1.formatOrder));
}
async function getAdminOrderById(req, res) {
    const id = String(req.params.id);
    const row = await models_1.Order.findByPk(id, {
        include: [{ model: models_1.OrderItem, as: "items", required: false }],
    });
    if (!row)
        return res.status(404).json({ message: "Order not found" });
    return res.json((0, serializers_1.formatOrder)(row));
}
async function updateAdminOrderStatus(req, res) {
    const id = String(req.params.id);
    const [affected] = await models_1.Order.update({ status: req.body.status }, { where: { id } });
    if (!affected)
        return res.status(404).json({ message: "Order not found" });
    return res.json({ message: "Order status updated" });
}
async function updateAdminOrder(req, res) {
    const id = String(req.params.id);
    const body = req.body;
    const { items, ...orderData } = body;
    const patch = pickOrderPatch(orderData);
    if (Object.keys(patch).length) {
        const [affected] = await models_1.Order.update(patch, { where: { id } });
        if (!affected)
            return res.status(404).json({ message: "Order not found" });
    }
    else if (!items) {
        const exists = await models_1.Order.findByPk(id);
        if (!exists)
            return res.status(404).json({ message: "Order not found" });
    }
    if (Array.isArray(items)) {
        await models_1.OrderItem.destroy({ where: { orderId: id } });
        for (const item of items) {
            const row = item;
            await models_1.OrderItem.create({
                id: (0, crypto_1.randomUUID)(),
                orderId: id,
                productId: String(row.id ?? row.productId ?? ""),
                productName: String(row.name ?? row.productName ?? "Item"),
                quantity: Number(row.quantity ?? 1),
                unitPrice: Number(row.price ?? row.unitPrice ?? 0),
            });
        }
        const total = items.reduce((sum, item) => {
            const qty = Number(item.quantity ?? 1);
            const price = Number(item.price ?? item.unitPrice ?? 0);
            return sum + qty * price;
        }, 0);
        await models_1.Order.update({ total }, { where: { id } });
    }
    const updated = await models_1.Order.findByPk(id, {
        include: [{ model: models_1.OrderItem, as: "items", required: false }],
    });
    return res.json({ message: "Order updated successfully", order: updated ? (0, serializers_1.formatOrder)(updated) : null });
}
async function deleteAdminOrder(req, res) {
    const id = String(req.params.id);
    const exists = await models_1.Order.findByPk(id);
    if (!exists)
        return res.status(404).json({ message: "Order not found" });
    await models_1.OrderItem.destroy({ where: { orderId: id } });
    await models_1.Order.destroy({ where: { id } });
    return res.json({ message: "Order deleted successfully" });
}
async function createAdminOrder(req, res) {
    const body = req.body;
    const id = `ADM-${Date.now()}`;
    const customerName = body.customerName || `${body.firstName || ""} ${body.lastName || ""}`.trim() || "Customer";
    const customerEmail = body.customerEmail || body.email;
    const total = body.items.reduce((sum, item) => sum + Number(item.price ?? 0) * Number(item.quantity ?? 1), 0);
    await models_1.Order.create({
        id,
        customerName,
        customerEmail,
        total,
        status: body.status || "pending",
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
    const created = await models_1.Order.findByPk(id, {
        include: [{ model: models_1.OrderItem, as: "items", required: false }],
    });
    return res.status(201).json({
        id,
        message: "Manual order created",
        order: created ? (0, serializers_1.formatOrder)(created) : null,
    });
}
async function getAdminFaqs(_req, res) {
    const rows = await models_1.Faq.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] });
    return res.json(rows.map((row) => (0, serializers_1.formatFaq)(row.toJSON(), { bilingual: true })));
}
async function replaceAdminFaqs(req, res) {
    const list = req.body;
    await models_1.Faq.destroy({ where: {} });
    for (const [index, faq] of list.entries()) {
        await models_1.Faq.create({
            id: (0, crypto_1.randomUUID)(),
            question: faq.question,
            answer: faq.answer,
            sortOrder: index,
        });
    }
    const rows = await models_1.Faq.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] });
    return res.json({
        message: "FAQs updated",
        faqs: rows.map((row) => (0, serializers_1.formatFaq)(row.toJSON(), { bilingual: true })),
    });
}
async function getAdminGallery(_req, res) {
    const rows = await models_1.Gallery.findAll({ order: [["createdAt", "DESC"]] });
    return res.json(rows.map((row) => (0, serializers_1.formatGalleryItem)(row, { bilingual: true })));
}
async function createAdminGallery(req, res) {
    const { id: clientId, src, alt, cols } = req.body;
    const id = clientId?.trim() || (0, crypto_1.randomUUID)();
    const row = await models_1.Gallery.create({ id, src, alt, cols });
    return res.status(201).json((0, serializers_1.formatGalleryItem)(row, { bilingual: true }));
}
async function deleteAdminGallery(req, res) {
    const id = String(req.params.id);
    const deleted = await models_1.Gallery.destroy({ where: { id } });
    if (!deleted)
        return res.status(404).json({ message: "Gallery image not found" });
    return res.json({ message: "Gallery image deleted" });
}
async function getAdminSettings(_req, res) {
    const row = await models_1.Setting.findByPk(1);
    if (!row)
        return res.status(404).json({ message: "Settings not found" });
    const j = row.toJSON();
    return res.json({
        ...(0, serializers_1.formatSettings)(j),
        siteContent: (0, mergeSiteContent_1.mergeSiteContent)(j.siteContent ?? j.site_content),
    });
}
async function updateAdminSettings(req, res) {
    const body = { ...req.body };
    if (body.siteContent !== undefined) {
        body.siteContent = (0, mergeSiteContent_1.mergeSiteContent)(body.siteContent);
    }
    if (body.tiktokUrl === "")
        body.tiktokUrl = "";
    if (body.youtubeUrl === "")
        body.youtubeUrl = "";
    const [affected] = await models_1.Setting.update(body, { where: { id: 1 } });
    if (!affected)
        return res.status(404).json({ message: "Settings not found" });
    return res.json({ message: "Settings updated" });
}
async function getAdminUsers(_req, res) {
    return res.json(await models_1.Admin.findAll({
        attributes: ["id", "name", "email", "role", "createdAt"],
        order: [["createdAt", "DESC"]],
    }));
}
