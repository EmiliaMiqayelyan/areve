import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { Admin, Faq, Gallery, Order, OrderItem, Product, Review, Setting } from "../models";
import { mergeSiteContent } from "../utils/mergeSiteContent";

export async function getAdminProducts(req: Request, res: Response) {
  return res.json(await Product.findAll({ order: [["createdAt", "DESC"]] }));
}
export async function createAdminProduct(req: Request, res: Response) {
  const row = await Product.create({ id: randomUUID(), ...req.body });
  return res.status(201).json({ id: row.get("id") });
}
export async function updateAdminProduct(req: Request, res: Response) {
  await Product.update(req.body, { where: { id: req.params.id } });
  return res.json({ message: "Product updated" });
}
export async function deleteAdminProduct(req: Request, res: Response) {
  await Product.destroy({ where: { id: req.params.id } });
  return res.json({ message: "Product deleted" });
}

export async function getAdminReviews(req: Request, res: Response) {
  return res.json(await Review.findAll({ order: [["createdAt", "DESC"]] }));
}
export async function createAdminReview(req: Request, res: Response) {
  const row = await Review.create({ id: randomUUID(), ...req.body });
  return res.status(201).json({ id: row.get("id") });
}
export async function updateAdminReview(req: Request, res: Response) {
  await Review.update(req.body, { where: { id: req.params.id } });
  return res.json({ message: "Review updated" });
}
export async function deleteAdminReview(req: Request, res: Response) {
  await Review.destroy({ where: { id: req.params.id } });
  return res.json({ message: "Review deleted" });
}

export async function getAdminOrders(req: Request, res: Response) {
  return res.json(await Order.findAll({ order: [["createdAt", "DESC"]] }));
}
export async function getAdminOrderById(req: Request, res: Response) {
  const id = String(req.params.id);
  const row = await Order.findByPk(id);
  if (!row) return res.status(404).json({ message: "Order not found" });
  const items = await OrderItem.findAll({ where: { orderId: id } });
  return res.json({ ...row.toJSON(), items });
}
export async function updateAdminOrderStatus(req: Request, res: Response) {
  await Order.update({ status: req.body.status }, { where: { id: req.params.id } });
  return res.json({ message: "Order status updated" });
}

export async function getAdminFaqs(req: Request, res: Response) {
  return res.json(await Faq.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] }));
}
export async function replaceAdminFaqs(req: Request, res: Response) {
  const list = req.body as Array<{ question: string; answer: string }>;
  await Faq.destroy({ where: {} });
  for (const [index, faq] of list.entries()) {
    await Faq.create({ id: randomUUID(), question: faq.question, answer: faq.answer, sortOrder: index });
  }
  return res.json({ message: "FAQs updated" });
}

export async function getAdminGallery(req: Request, res: Response) {
  return res.json(await Gallery.findAll({ order: [["createdAt", "DESC"]] }));
}
export async function createAdminGallery(req: Request, res: Response) {
  const row = await Gallery.create({ id: randomUUID(), ...req.body });
  return res.status(201).json({ id: row.get("id") });
}
export async function deleteAdminGallery(req: Request, res: Response) {
  await Gallery.destroy({ where: { id: req.params.id } });
  return res.json({ message: "Gallery image deleted" });
}

export async function getAdminSettings(req: Request, res: Response) {
  const row = await Setting.findByPk(1);
  if (!row) return res.status(404).json({ message: "Settings not found" });
  const j = row.toJSON() as Record<string, unknown>;
  return res.json({ ...j, siteContent: mergeSiteContent(j.siteContent) });
}
export async function updateAdminSettings(req: Request, res: Response) {
  const body = { ...req.body } as Record<string, unknown>;
  if (body.siteContent !== undefined) {
    body.siteContent = mergeSiteContent(body.siteContent);
  }
  await Setting.update(body, { where: { id: 1 } });
  return res.json({ message: "Settings updated" });
}

export async function getAdminUsers(req: Request, res: Response) {
  return res.json(
    await Admin.findAll({
      attributes: ["id", "name", "email", "role", "createdAt"],
      order: [["createdAt", "DESC"]],
    })
  );
}
