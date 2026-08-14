import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { Op } from "sequelize";
import { Contact, Category, Faq, Gallery, Order, OrderItem, Product, Review, Setting } from "../models";
import { getCachedPublicSettings, setCachedPublicSettings } from "../utils/publicCache";
import {
  formatCategory,
  formatFaq,
  formatGalleryItem,
  formatProduct,
  formatReview,
  resolveRequestLocale,
} from "../utils/serializers";
import { normalizeResourceId } from "../utils/resourceId";

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
] as const;

const PUBLIC_DETAIL_ATTRIBUTES = [...PUBLIC_LIST_ATTRIBUTES, "description"] as const;

function setPublicCache(res: Response, maxAge = 60) {
  res.setHeader("Cache-Control", `public, max-age=${maxAge}, stale-while-revalidate=${maxAge * 5}`);
  res.setHeader("Vary", "Origin, Accept-Language");
}

function parsePositiveInt(value: unknown, fallback: number, max: number) {
  const n = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(n, max);
}

export async function getHealth(_req: Request, res: Response) {
  return res.json({ status: "ok" });
}

export async function getPublicSettings(_req: Request, res: Response) {
  const cached = getCachedPublicSettings();
  if (cached) {
    setPublicCache(res, 120);
    return res.json(cached);
  }

  const row = await Setting.findByPk(1, {
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
  if (!row) return res.status(404).json({ message: "Settings not found" });
  const j = row.toJSON() as Record<string, unknown>;
  const payload = {
    storeName: j.storeName ?? j.store_name,
    tagline: j.tagline,
    footerDescription: j.footerDescription ?? j.footer_description,
    supportEmail: j.supportEmail ?? j.support_email,
    businessPhone: "041802122",
    address: j.address,
    instagramUrl: j.instagramUrl ?? j.instagram_url,
    facebookUrl: j.facebookUrl ?? j.facebook_url,
    whatsappUrl: "https://wa.me/37441802122",
    telegramUrl: "https://t.me/+37441802122",
    tiktokUrl: j.tiktokUrl ?? j.tiktok_url ?? "",
    youtubeUrl: j.youtubeUrl ?? j.youtube_url ?? "",
  };
  setCachedPublicSettings(payload);
  setPublicCache(res, 120);
  return res.json(payload);
}

export async function getProducts(req: Request, res: Response) {
  const locale = resolveRequestLocale(req);
  const where: Record<string, unknown> = {};
  if (req.query.active === "true") where.status = "active";
  if (req.query.favorite === "true") where.isFavorite = true;

  const category = String(req.query.category ?? "").trim();
  if (category && category !== "all") where.category = category;

  const excludeId = normalizeResourceId(String(req.query.excludeId ?? "").trim());
  if (excludeId) where.id = { [Op.ne]: excludeId };

  const limit = parsePositiveInt(req.query.limit, 0, 100);
  const page = parsePositiveInt(req.query.page, 1, 1000);
  const offset = limit > 0 ? (page - 1) * limit : undefined;

  const rows = await Product.findAll({
    attributes: [...PUBLIC_LIST_ATTRIBUTES],
    where: Object.keys(where).length ? where : undefined,
    order: [["sortOrder", "ASC"], ["createdAt", "DESC"]],
    ...(limit > 0 ? { limit, offset } : {}),
  });

  setPublicCache(res, 60);
  return res.json(rows.map((row) => formatProduct(row, { locale, list: true })));
}

export async function getProductById(req: Request, res: Response) {
  const locale = resolveRequestLocale(req);
  const id = normalizeResourceId(String(req.params.id));
  const row = await Product.findByPk(id, { attributes: [...PUBLIC_DETAIL_ATTRIBUTES] });
  if (!row) return res.status(404).json({ message: "Product not found" });
  setPublicCache(res, 120);
  return res.json(formatProduct(row, { locale }));
}

export async function getReviews(req: Request, res: Response) {
  const locale = resolveRequestLocale(req);
  const rows = await Review.findAll({
    where: { status: "approved" },
    order: [["createdAt", "DESC"]],
  });
  setPublicCache(res, 120);
  return res.json(rows.map((row) => formatReview(row, { locale })));
}

export async function getFaqs(req: Request, res: Response) {
  const locale = resolveRequestLocale(req);
  const rows = await Faq.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] });
  setPublicCache(res, 300);
  return res.json(rows.map((row) => formatFaq(row.toJSON() as Record<string, unknown>, { locale })));
}

export async function getGallery(req: Request, res: Response) {
  const locale = resolveRequestLocale(req);
  const limit = parsePositiveInt(req.query.limit, 0, 50);
  const rows = await Gallery.findAll({
    order: [["sortOrder", "ASC"], ["createdAt", "DESC"]],
    ...(limit > 0 ? { limit } : {}),
  });
  setPublicCache(res, 120);
  return res.json(rows.map((row) => formatGalleryItem(row, { locale })));
}

export async function getCategories(req: Request, res: Response) {
  const locale = resolveRequestLocale(req);
  const rows = await Category.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] });
  setPublicCache(res, 300);
  return res.json(rows.map((row) => formatCategory(row.toJSON() as Record<string, unknown>, { locale })));
}

export async function createContact(req: Request, res: Response) {
  const id = randomUUID();
  await Contact.create({ id, ...req.body });
  return res.status(201).json({ id, message: "Inquiry received" });
}

export async function createOrder(req: Request, res: Response) {
  const body = req.body;
  const id = `ORD-${Date.now()}`;
  const fullName = `${body.firstName} ${body.lastName}`.trim();
  const total = body.items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  await Order.create({
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
    const product = await Product.findByPk(String(item.id));
    const unitCost = product ? Number((product.toJSON() as Record<string, unknown>).cost ?? 0) : 0;
    await OrderItem.create({
      id: randomUUID(),
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
