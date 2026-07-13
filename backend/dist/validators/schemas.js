"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsSchema = exports.categoryUpdateSchema = exports.categoryCreateSchema = exports.faqReplaceSchema = exports.adminOrderUpdateSchema = exports.adminOrderCreateSchema = exports.orderStatusSchema = exports.adminCredentialsUpdateSchema = exports.loginSchema = exports.orderSchema = exports.contactSchema = exports.gallerySchema = exports.faqSchema = exports.reviewCreateSchema = exports.reviewSchema = exports.productCreateSchema = exports.productSchema = void 0;
const zod_1 = require("zod");
const localizedText_1 = require("../utils/localizedText");
const optionalUrlOrEmpty = zod_1.z.union([zod_1.z.string().url(), zod_1.z.literal("")]).optional();
const telegramContactOrEmpty = zod_1.z.union([
    zod_1.z.string().url(),
    zod_1.z.string().regex(/^@?[A-Za-z0-9_]{5,32}$/),
    zod_1.z.literal(""),
]).optional();
const localizedTextSchema = zod_1.z
    .union([
    zod_1.z.string().min(1).max(5000),
    zod_1.z.object({
        hy: zod_1.z.string().min(1).max(5000),
        en: zod_1.z.string().max(5000).optional(),
    }),
])
    .transform(localizedText_1.normalizeLocalizedInput);
const optionalLocalizedTextSchema = zod_1.z
    .union([
    zod_1.z.string().max(5000),
    zod_1.z.object({
        hy: zod_1.z.string().max(5000).optional(),
        en: zod_1.z.string().max(5000).optional(),
    }),
    zod_1.z.null(),
])
    .optional()
    .nullable()
    .transform((value) => {
    if (value == null || value === "")
        return null;
    const normalized = (0, localizedText_1.normalizeLocalizedInput)(value);
    if (!normalized.hy && !normalized.en)
        return null;
    return normalized;
});
exports.productSchema = zod_1.z.object({
    name: localizedTextSchema,
    price: zod_1.z.coerce.number().positive(),
    image: zod_1.z.string().min(1),
    category: zod_1.z.string().min(1).max(64),
    cost: zod_1.z.coerce.number().nonnegative().optional(),
    badge: optionalLocalizedTextSchema,
    description: optionalLocalizedTextSchema,
    status: zod_1.z.enum(["active", "inactive"]).default("active"),
});
exports.productCreateSchema = exports.productSchema.extend({
    id: zod_1.z.string().min(1).max(64).optional(),
});
exports.reviewSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(120),
    location: zod_1.z.string().max(120).optional().nullable(),
    product: localizedTextSchema,
    rating: zod_1.z.coerce.number().int().min(1).max(5),
    comment: localizedTextSchema,
    status: zod_1.z.enum(["approved", "pending", "rejected"]).default("pending"),
});
exports.reviewCreateSchema = exports.reviewSchema.extend({
    id: zod_1.z.string().min(1).max(64).optional(),
});
exports.faqSchema = zod_1.z.object({
    question: localizedTextSchema,
    answer: localizedTextSchema,
});
exports.gallerySchema = zod_1.z.object({
    id: zod_1.z.string().min(1).max(64).optional(),
    src: zod_1.z.string().min(1),
    alt: localizedTextSchema,
    cols: zod_1.z.coerce.number().int().min(1).max(2),
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
exports.adminCredentialsUpdateSchema = zod_1.z
    .object({
    currentPassword: zod_1.z.string().min(1).max(100),
    newEmail: zod_1.z.string().email().optional(),
    newPassword: zod_1.z.string().min(6).max(100).optional(),
    confirmPassword: zod_1.z.string().max(100).optional(),
})
    .superRefine((data, ctx) => {
    if (!data.newEmail && !data.newPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Provide a new email and/or new password",
        });
    }
    if (data.newPassword && data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirmPassword"],
        });
    }
});
exports.orderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["pending", "shipped", "delivered"]),
});
exports.adminOrderCreateSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(1).max(160),
    delivery: zod_1.z.string().max(100).optional(),
    packaging: zod_1.z.string().max(100).optional(),
    soldAt: zod_1.z.string().min(1).optional(),
    items: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.string().min(1),
        name: zod_1.z.string().min(1).max(120),
        quantity: zod_1.z.coerce.number().int().min(1),
        price: zod_1.z.coerce.number().nonnegative(),
        unitCost: zod_1.z.coerce.number().nonnegative().optional(),
    }))
        .min(1),
});
/** Admin dashboard order edits (customer/shipping fields). */
exports.adminOrderUpdateSchema = zod_1.z.object({
    customerName: zod_1.z.string().min(1).max(160).optional(),
    customerEmail: zod_1.z.string().email().optional(),
    address: zod_1.z.string().min(1).max(255).optional(),
    city: zod_1.z.string().min(1).max(100).optional(),
    state: zod_1.z.string().min(1).max(100).optional(),
    zipCode: zod_1.z.string().min(1).max(30).optional(),
    status: zod_1.z.enum(["pending", "shipped", "delivered"]).optional(),
    total: zod_1.z.coerce.number().nonnegative().optional(),
    items: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.string().optional(),
        productId: zod_1.z.string().optional(),
        name: zod_1.z.string().min(1).max(120).optional(),
        productName: zod_1.z.string().min(1).max(120).optional(),
        quantity: zod_1.z.coerce.number().int().min(1),
        price: zod_1.z.coerce.number().positive().optional(),
        unitPrice: zod_1.z.coerce.number().positive().optional(),
    }))
        .optional(),
});
exports.faqReplaceSchema = zod_1.z.array(zod_1.z.object({
    id: zod_1.z.string().optional(),
    question: localizedTextSchema,
    answer: localizedTextSchema,
}));
const categorySlugSchema = zod_1.z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only");
exports.categoryCreateSchema = zod_1.z.object({
    id: categorySlugSchema,
    name: localizedTextSchema,
    sortOrder: zod_1.z.coerce.number().int().min(0).optional(),
});
exports.categoryUpdateSchema = zod_1.z.object({
    name: localizedTextSchema.optional(),
    sortOrder: zod_1.z.coerce.number().int().min(0).optional(),
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
    telegramUrl: telegramContactOrEmpty,
    tiktokUrl: optionalUrlOrEmpty,
    youtubeUrl: optionalUrlOrEmpty,
    siteContent: zod_1.z.any().optional(),
});
