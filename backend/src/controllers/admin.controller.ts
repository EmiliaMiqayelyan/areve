import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { Admin, Category, Faq, Gallery, Order, OrderItem, Product, Review, Setting } from "../models";
import { invalidatePublicSettingsCache } from "../utils/publicCache";
import { mergeSiteContent } from "../utils/mergeSiteContent";
import { isDataUrlImage, persistDataUrlImage } from "../utils/persistUpload";
import {
  formatCategory,
  formatFaq,
  formatGalleryItem,
  formatOrder,
  formatProduct,
  formatReview,
  formatSettings,
} from "../utils/serializers";
import { normalizeResourceId } from "../utils/resourceId";

const ORDER_PATCH_FIELDS = [
  "customerName",
  "customerEmail",
  "address",
  "city",
  "state",
  "zipCode",
  "status",
  "total",
] as const;

function pickOrderPatch(body: Record<string, unknown>) {
  const patch: Record<string, unknown> = {};
  for (const key of ORDER_PATCH_FIELDS) {
    if (body[key] !== undefined) patch[key] = body[key];
  }
  return patch;
}

async function categoryExists(categoryId: string) {
  return Boolean(await Category.findByPk(categoryId));
}

export async function getAdminProducts(_req: Request, res: Response) {
  const rows = await Product.findAll({ order: [["sortOrder", "ASC"], ["createdAt", "DESC"]] });
  return res.json(rows.map((row) => formatProduct(row, { bilingual: true })));
}

export async function getAdminProduct(req: Request, res: Response) {
  const id = normalizeResourceId(String(req.params.id));
  const row = await Product.findByPk(id);
  if (!row) return res.status(404).json({ message: "Product not found" });
  return res.json(formatProduct(row, { bilingual: true }));
}

export async function createAdminProduct(req: Request, res: Response) {
  const { id: clientId, ...data } = req.body as Record<string, unknown>;
  if (typeof data.category === "string" && !(await categoryExists(data.category))) {
    return res.status(400).json({ message: "Category not found" });
  }
  const id = typeof clientId === "string" && clientId.trim() ? clientId.trim() : randomUUID();

  let image = String(data.image ?? "").trim();
  if (isDataUrlImage(image)) {
    image = await persistDataUrlImage(image, "products", id);
  }
  if (!image) {
    return res.status(400).json({ message: "Image is required" });
  }

  const minSort = await Product.min("sortOrder");
  const sortOrder = Number.isFinite(Number(minSort)) ? Number(minSort) - 1 : 0;

  const row = await Product.create({
    ...data,
    id,
    image,
    sortOrder,
  });
  return res.status(201).json(formatProduct(row, { bilingual: true }));
}

export async function updateAdminProduct(req: Request, res: Response) {
  const id = normalizeResourceId(String(req.params.id));
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: "No fields to update" });
  }
  if (typeof req.body.category === "string" && !(await categoryExists(req.body.category))) {
    return res.status(400).json({ message: "Category not found" });
  }

  const body = { ...req.body } as Record<string, unknown>;
  if (typeof body.image === "string" && isDataUrlImage(body.image)) {
    body.image = await persistDataUrlImage(body.image, "products", id);
  }

  const [affected] = await Product.update(body, { where: { id } });
  if (!affected) return res.status(404).json({ message: "Product not found" });
  const row = await Product.findByPk(id);
  return res.json({
    message: "Product updated",
    product: row ? formatProduct(row, { bilingual: true }) : null,
  });
}

export async function reorderAdminProducts(req: Request, res: Response) {
  const ids = (req.body as { ids?: unknown }).ids;
  if (!Array.isArray(ids) || ids.length === 0 || !ids.every((id) => typeof id === "string" && id.trim())) {
    return res.status(400).json({ message: "ids must be a non-empty string array" });
  }

  const uniqueIds = [...new Set(ids.map((id) => String(id).trim()))];
  const existing = await Product.findAll({ attributes: ["id"] });
  const existingIds = new Set(existing.map((row) => String(row.get("id"))));

  if (uniqueIds.length !== existingIds.size || uniqueIds.some((id) => !existingIds.has(id))) {
    return res.status(400).json({ message: "ids must include every product exactly once" });
  }

  await Promise.all(
    uniqueIds.map((productId, index) => Product.update({ sortOrder: index }, { where: { id: productId } }))
  );

  const rows = await Product.findAll({ order: [["sortOrder", "ASC"], ["createdAt", "DESC"]] });
  return res.json(rows.map((row) => formatProduct(row, { bilingual: true })));
}

export async function deleteAdminProduct(req: Request, res: Response) {
  const id = normalizeResourceId(String(req.params.id));
  const deleted = await Product.destroy({ where: { id } });
  if (!deleted) return res.status(404).json({ message: "Product not found" });
  return res.json({ message: "Product deleted" });
}

export async function getAdminReviews(_req: Request, res: Response) {
  const rows = await Review.findAll({ order: [["createdAt", "DESC"]] });
  return res.json(rows.map((row) => formatReview(row, { bilingual: true })));
}

export async function createAdminReview(req: Request, res: Response) {
  const { id: clientId, ...data } = req.body as Record<string, unknown>;
  const id = typeof clientId === "string" && clientId.trim() ? clientId.trim() : randomUUID();
  const row = await Review.create({ id, ...data });
  return res.status(201).json(formatReview(row, { bilingual: true }));
}

export async function updateAdminReview(req: Request, res: Response) {
  const id = String(req.params.id);
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: "No fields to update" });
  }
  const [affected] = await Review.update(req.body, { where: { id } });
  if (!affected) return res.status(404).json({ message: "Review not found" });
  return res.json({ message: "Review updated" });
}

export async function deleteAdminReview(req: Request, res: Response) {
  const id = String(req.params.id);
  const deleted = await Review.destroy({ where: { id } });
  if (!deleted) return res.status(404).json({ message: "Review not found" });
  return res.json({ message: "Review deleted" });
}

export async function getAdminOrders(_req: Request, res: Response) {
  const rows = await Order.findAll({
    order: [["createdAt", "DESC"]],
    include: [{ model: OrderItem, as: "items", required: false }],
  });
  return res.json(rows.map(formatOrder));
}

export async function getAdminOrderById(req: Request, res: Response) {
  const id = String(req.params.id);
  const row = await Order.findByPk(id, {
    include: [{ model: OrderItem, as: "items", required: false }],
  });
  if (!row) return res.status(404).json({ message: "Order not found" });
  return res.json(formatOrder(row));
}

export async function updateAdminOrderStatus(req: Request, res: Response) {
  const id = String(req.params.id);
  const [affected] = await Order.update({ status: req.body.status }, { where: { id } });
  if (!affected) return res.status(404).json({ message: "Order not found" });
  return res.json({ message: "Order status updated" });
}

export async function updateAdminOrder(req: Request, res: Response) {
  const id = String(req.params.id);
  const body = req.body as Record<string, unknown>;
  const { items, ...orderData } = body;

  const patch = pickOrderPatch(orderData);
  if (Object.keys(patch).length) {
    const [affected] = await Order.update(patch, { where: { id } });
    if (!affected) return res.status(404).json({ message: "Order not found" });
  } else if (!items) {
    const exists = await Order.findByPk(id);
    if (!exists) return res.status(404).json({ message: "Order not found" });
  }

  if (Array.isArray(items)) {
    await OrderItem.destroy({ where: { orderId: id } });
    for (const item of items) {
      const row = item as Record<string, unknown>;
      await OrderItem.create({
        id: randomUUID(),
        orderId: id,
        productId: String(row.id ?? row.productId ?? ""),
        productName: String(row.name ?? row.productName ?? "Item"),
        quantity: Number(row.quantity ?? 1),
        unitPrice: Number(row.price ?? row.unitPrice ?? 0),
      });
    }
    const total = items.reduce((sum: number, item: Record<string, unknown>) => {
      const qty = Number(item.quantity ?? 1);
      const price = Number(item.price ?? item.unitPrice ?? 0);
      return sum + qty * price;
    }, 0);
    await Order.update({ total }, { where: { id } });
  }

  const updated = await Order.findByPk(id, {
    include: [{ model: OrderItem, as: "items", required: false }],
  });
  return res.json({ message: "Order updated successfully", order: updated ? formatOrder(updated) : null });
}

export async function deleteAdminOrder(req: Request, res: Response) {
  const id = String(req.params.id);
  const exists = await Order.findByPk(id);
  if (!exists) return res.status(404).json({ message: "Order not found" });
  await OrderItem.destroy({ where: { orderId: id } });
  await Order.destroy({ where: { id } });
  return res.json({ message: "Order deleted successfully" });
}

export async function createAdminOrder(req: Request, res: Response) {
  const body = req.body as {
    customerName?: string;
    delivery?: string;
    packaging?: string;
    soldAt?: string;
    firstName?: string;
    lastName?: string;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
      unitCost?: number;
    }>;
  };
  const id = `ADM-${Date.now()}`;
  const customerName =
    body.customerName || `${body.firstName || ""} ${body.lastName || ""}`.trim() || "Customer";
  const customerEmail = "sale@areve.com";
  const total = body.items.reduce(
    (sum, item) => sum + Number(item.price ?? 0) * Number(item.quantity ?? 1),
    0
  );
  const soldAt = body.soldAt ? new Date(body.soldAt) : new Date();

  await Order.create({
    id,
    customerName,
    customerEmail,
    total,
    status: "delivered",
    address: "Manual sale",
    city: (body.packaging || "").trim() || "—",
    state: (body.delivery || "").trim() || "—",
    zipCode: "—",
    createdAt: soldAt,
  });

  for (const item of body.items) {
    const product = await Product.findByPk(String(item.id));
    const unitCost =
      item.unitCost !== undefined
        ? Number(item.unitCost)
        : product
          ? Number((product.toJSON() as Record<string, unknown>).cost ?? 0)
          : 0;
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

  const created = await Order.findByPk(id, {
    include: [{ model: OrderItem, as: "items", required: false }],
  });
  return res.status(201).json({
    id,
    message: "Manual order created",
    order: created ? formatOrder(created) : null,
  });
}

export async function getAdminFaqs(_req: Request, res: Response) {
  const rows = await Faq.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] });
  return res.json(rows.map((row) => formatFaq(row.toJSON() as Record<string, unknown>, { bilingual: true })));
}

export async function replaceAdminFaqs(req: Request, res: Response) {
  const list = req.body as Array<{ question: string; answer: string }>;
  await Faq.destroy({ where: {} });
  for (const [index, faq] of list.entries()) {
    await Faq.create({
      id: randomUUID(),
      question: faq.question,
      answer: faq.answer,
      sortOrder: index,
    });
  }
  const rows = await Faq.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] });
  return res.json({
    message: "FAQs updated",
    faqs: rows.map((row) => formatFaq(row.toJSON() as Record<string, unknown>, { bilingual: true })),
  });
}

export async function getAdminGallery(_req: Request, res: Response) {
  const rows = await Gallery.findAll({ order: [["sortOrder", "ASC"], ["createdAt", "DESC"]] });
  return res.json(rows.map((row) => formatGalleryItem(row, { bilingual: true })));
}

export async function createAdminGallery(req: Request, res: Response) {
  const { id: clientId, src, alt, cols } = req.body as {
    id?: string;
    src: string;
    alt: string | { hy: string; en?: string };
    cols: number;
  };
  const id = clientId?.trim() || randomUUID();

  let storedSrc = String(src || "").trim();
  if (isDataUrlImage(storedSrc)) {
    storedSrc = await persistDataUrlImage(storedSrc, "gallery", id);
  }
  if (!storedSrc) {
    return res.status(400).json({ message: "Image is required" });
  }

  const minSort = await Gallery.min("sortOrder");
  const sortOrder = Number.isFinite(Number(minSort)) ? Number(minSort) - 1 : 0;
  const row = await Gallery.create({ id, src: storedSrc, alt, cols, sortOrder });
  return res.status(201).json(formatGalleryItem(row, { bilingual: true }));
}

export async function reorderAdminGallery(req: Request, res: Response) {
  const ids = (req.body as { ids?: unknown }).ids;
  if (!Array.isArray(ids) || ids.length === 0 || !ids.every((id) => typeof id === "string" && id.trim())) {
    return res.status(400).json({ message: "ids must be a non-empty string array" });
  }

  const uniqueIds = [...new Set(ids.map((id) => String(id).trim()))];
  const existing = await Gallery.findAll({ attributes: ["id"] });
  const existingIds = new Set(existing.map((row) => String(row.get("id"))));

  if (uniqueIds.length !== existingIds.size || uniqueIds.some((id) => !existingIds.has(id))) {
    return res.status(400).json({ message: "ids must include every gallery image exactly once" });
  }

  await Promise.all(
    uniqueIds.map((id, index) => Gallery.update({ sortOrder: index }, { where: { id } }))
  );

  const rows = await Gallery.findAll({ order: [["sortOrder", "ASC"], ["createdAt", "DESC"]] });
  return res.json(rows.map((row) => formatGalleryItem(row, { bilingual: true })));
}

export async function deleteAdminGallery(req: Request, res: Response) {
  const id = String(req.params.id);
  const deleted = await Gallery.destroy({ where: { id } });
  if (!deleted) return res.status(404).json({ message: "Gallery image not found" });
  return res.json({ message: "Gallery image deleted" });
}

export async function getAdminSettings(_req: Request, res: Response) {
  const row = await Setting.findByPk(1);
  if (!row) return res.status(404).json({ message: "Settings not found" });
  const j = row.toJSON() as Record<string, unknown>;
  return res.json({
    ...formatSettings(j),
    siteContent: mergeSiteContent(j.siteContent ?? j.site_content),
  });
}

export async function updateAdminSettings(req: Request, res: Response) {
  const body = { ...req.body } as Record<string, unknown>;
  // Storefront copy is code-owned; never persist admin JSON overrides.
  if (body.siteContent !== undefined) {
    body.siteContent = mergeSiteContent();
  }
  if (body.tiktokUrl === "") body.tiktokUrl = "";
  if (body.youtubeUrl === "") body.youtubeUrl = "";
  if (body.telegramUrl === "") body.telegramUrl = "";

  const [affected] = await Setting.update(body, { where: { id: 1 } });
  if (!affected) return res.status(404).json({ message: "Settings not found" });
  invalidatePublicSettingsCache();
  return res.json({ message: "Settings updated" });
}

export async function getAdminUsers(_req: Request, res: Response) {
  return res.json(
    await Admin.findAll({
      attributes: ["id", "name", "email", "role", "createdAt"],
      order: [["createdAt", "DESC"]],
    })
  );
}

export async function getAdminCategories(_req: Request, res: Response) {
  const rows = await Category.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] });
  return res.json(rows.map((row) => formatCategory(row.toJSON() as Record<string, unknown>, { bilingual: true })));
}

export async function createAdminCategory(req: Request, res: Response) {
  const { id, name, sortOrder } = req.body as { id: string; name: unknown; sortOrder?: number };
  const existing = await Category.findByPk(id);
  if (existing) return res.status(409).json({ message: "Category id already exists" });
  const row = await Category.create({ id, name, sortOrder: sortOrder ?? 0 });
  return res.status(201).json(formatCategory(row.toJSON() as Record<string, unknown>, { bilingual: true }));
}

export async function updateAdminCategory(req: Request, res: Response) {
  const id = String(req.params.id);
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: "No fields to update" });
  }
  const [affected] = await Category.update(req.body, { where: { id } });
  if (!affected) return res.status(404).json({ message: "Category not found" });
  const row = await Category.findByPk(id);
  return res.json({
    message: "Category updated",
    category: row ? formatCategory(row.toJSON() as Record<string, unknown>, { bilingual: true }) : null,
  });
}

export async function deleteAdminCategory(req: Request, res: Response) {
  const id = String(req.params.id);
  const inUse = await Product.count({ where: { category: id } });
  if (inUse > 0) {
    return res.status(400).json({ message: "Cannot delete a category that is used by products" });
  }
  const deleted = await Category.destroy({ where: { id } });
  if (!deleted) return res.status(404).json({ message: "Category not found" });
  return res.json({ message: "Category deleted" });
}
