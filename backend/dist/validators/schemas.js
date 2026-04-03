"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsSchema = exports.orderStatusSchema = exports.loginSchema = exports.orderSchema = exports.contactSchema = exports.gallerySchema = exports.faqSchema = exports.reviewSchema = exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(120),
    price: zod_1.z.number().positive(),
    image: zod_1.z.string().min(1),
    category: zod_1.z.enum(["bags", "toys", "accessories"]),
    badge: zod_1.z.string().max(40).optional().nullable(),
    description: zod_1.z.string().max(5000).optional().nullable(),
    status: zod_1.z.enum(["active", "inactive"]).default("active"),
});
exports.reviewSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(120),
    location: zod_1.z.string().max(120).optional().nullable(),
    product: zod_1.z.string().min(2).max(120),
    rating: zod_1.z.number().int().min(1).max(5),
    comment: zod_1.z.string().min(5).max(1500),
    status: zod_1.z.enum(["approved", "pending", "rejected"]).default("pending"),
});
exports.faqSchema = zod_1.z.object({
    question: zod_1.z.string().min(5).max(400),
    answer: zod_1.z.string().min(5).max(3000),
});
exports.gallerySchema = zod_1.z.object({
    src: zod_1.z.string().min(1),
    alt: zod_1.z.string().min(2).max(180),
    cols: zod_1.z.number().int().min(1).max(2),
});
exports.contactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(120),
    email: zod_1.z.string().email(),
    message: zod_1.z.string().min(10).max(3000),
});
exports.orderSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string().min(1).max(120),
    lastName: zod_1.z.string().min(1).max(120),
    address: zod_1.z.string().min(5).max(255),
    city: zod_1.z.string().min(1).max(100),
    state: zod_1.z.string().min(1).max(100),
    zipCode: zod_1.z.string().min(1).max(30),
    items: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string().min(1).max(120),
        quantity: zod_1.z.number().int().min(1),
        price: zod_1.z.number().positive(),
    }))
        .min(1),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(100),
});
exports.orderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["pending", "shipped", "delivered"]),
});
exports.settingsSchema = zod_1.z.object({
    storeName: zod_1.z.string().min(1).max(120),
    tagline: zod_1.z.string().max(240),
    footerDescription: zod_1.z.string().max(2000),
    supportEmail: zod_1.z.string().email(),
    businessPhone: zod_1.z.string().max(50),
    address: zod_1.z.string().max(255),
    instagramUrl: zod_1.z.string().url(),
    facebookUrl: zod_1.z.string().url(),
    whatsappUrl: zod_1.z.string().url(),
});
