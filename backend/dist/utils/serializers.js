"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatProduct = formatProduct;
exports.formatReview = formatReview;
exports.formatFaq = formatFaq;
exports.formatCategory = formatCategory;
exports.formatGalleryItem = formatGalleryItem;
exports.formatOrderItem = formatOrderItem;
exports.formatOrder = formatOrder;
exports.formatSettings = formatSettings;
exports.resolveRequestLocale = resolveRequestLocale;
const localizedText_1 = require("./localizedText");
function publicImageSrc(image) {
    const src = String(image ?? "").trim();
    if (!src || src.startsWith("data:") || src.startsWith("blob:")) {
        return "/images/prod-bag-a.png";
    }
    return src;
}
function asRecord(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    return {};
}
function formatLocalizedField(value, opts) {
    if (opts?.bilingual)
        return (0, localizedText_1.parseLocalized)(value);
    return (0, localizedText_1.pickLocalized)(value, opts?.locale ?? "hy");
}
function formatProduct(product, opts) {
    const j = typeof product.toJSON === "function"
        ? product.toJSON()
        : asRecord(product);
    const payload = {
        id: j.id,
        name: formatLocalizedField(j.name, opts),
        price: Number(j.price ?? 0),
        image: opts?.bilingual ? j.image : publicImageSrc(j.image),
        category: j.category,
        badge: j.badge != null ? formatLocalizedField(j.badge, opts) : null,
        status: j.status ?? "active",
        isFavorite: Boolean(j.isFavorite ?? j.is_favorite ?? false),
        sortOrder: Number(j.sortOrder ?? j.sort_order ?? 0),
        createdAt: j.createdAt ?? j.created_at ?? null,
    };
    if (opts?.bilingual) {
        payload.cost = Number(j.cost ?? 0);
    }
    if (!opts?.list) {
        payload.description = j.description != null ? formatLocalizedField(j.description, opts) : null;
    }
    return payload;
}
function formatReview(review, opts) {
    const j = typeof review.toJSON === "function"
        ? review.toJSON()
        : asRecord(review);
    return {
        id: j.id,
        name: j.name,
        location: j.location ?? null,
        product: formatLocalizedField(j.product, opts),
        rating: Number(j.rating ?? 0),
        comment: formatLocalizedField(j.comment, opts),
        status: j.status ?? "pending",
        createdAt: j.createdAt ?? j.created_at ?? null,
    };
}
function formatFaq(faq, opts) {
    return {
        id: faq.id,
        question: formatLocalizedField(faq.question, opts),
        answer: formatLocalizedField(faq.answer, opts),
        sortOrder: faq.sortOrder ?? faq.sort_order ?? 0,
    };
}
function formatCategory(category, opts) {
    return {
        id: category.id,
        name: formatLocalizedField(category.name, opts),
        sortOrder: category.sortOrder ?? category.sort_order ?? 0,
    };
}
function formatGalleryItem(item, opts) {
    const j = typeof item.toJSON === "function"
        ? item.toJSON()
        : asRecord(item);
    return {
        id: j.id,
        src: j.src,
        alt: formatLocalizedField(j.alt, opts),
        cols: Number(j.cols ?? 1),
        sortOrder: Number(j.sortOrder ?? j.sort_order ?? 0),
        createdAt: j.createdAt ?? j.created_at ?? null,
    };
}
function formatOrderItem(item) {
    const j = typeof item.toJSON === "function"
        ? item.toJSON()
        : asRecord(item);
    return {
        id: String(j.productId ?? j.product_id ?? ""),
        name: String(j.productName ?? j.product_name ?? ""),
        quantity: Number(j.quantity ?? 0),
        price: Number(j.unitPrice ?? j.unit_price ?? 0),
        unitCost: Number(j.unitCost ?? j.unit_cost ?? 0),
        stoneType: String(j.stoneType ?? j.stone_type ?? ""),
        stoneMm: String(j.stoneMm ?? j.stone_mm ?? ""),
        bagSize: String(j.bagSize ?? j.bag_size ?? ""),
        stonePrice: Number(j.stonePrice ?? j.stone_price ?? 0),
        bagPrice: Number(j.bagPrice ?? j.bag_price ?? 0),
    };
}
function formatOrder(order) {
    const j = typeof order.toJSON === "function"
        ? order.toJSON()
        : asRecord(order);
    const rawItems = Array.isArray(j.items) ? j.items : [];
    const createdAt = j.createdAt ?? j.created_at ?? null;
    return {
        id: j.id,
        customerName: j.customerName ?? j.customer_name,
        customerEmail: j.customerEmail ?? j.customer_email,
        total: Number(j.total ?? 0),
        status: j.status,
        address: j.address,
        city: j.city,
        state: j.state,
        zipCode: j.zipCode ?? j.zip_code,
        createdAt,
        date: createdAt,
        items: rawItems.map((item) => formatOrderItem(item)),
    };
}
function formatSettings(row) {
    const rawContent = row.siteContent ?? row.site_content;
    return {
        storeName: row.storeName ?? row.store_name,
        tagline: row.tagline,
        footerDescription: row.footerDescription ?? row.footer_description,
        supportEmail: row.supportEmail ?? row.support_email,
        businessPhone: row.businessPhone ?? row.business_phone,
        address: row.address,
        instagramUrl: row.instagramUrl ?? row.instagram_url,
        facebookUrl: row.facebookUrl ?? row.facebook_url,
        whatsappUrl: row.whatsappUrl ?? row.whatsapp_url,
        telegramUrl: row.telegramUrl ?? row.telegram_url ?? "",
        tiktokUrl: row.tiktokUrl ?? row.tiktok_url ?? "",
        youtubeUrl: row.youtubeUrl ?? row.youtube_url ?? "",
        siteContent: rawContent,
    };
}
function resolveRequestLocale(req) {
    const raw = String(req.query.locale ?? "hy");
    return raw === "en" ? "en" : "hy";
}
