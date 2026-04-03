import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { Contact, Faq, Gallery, Order, OrderItem, Product, Review } from "../models";

export async function getHealth(req: Request, res: Response) {
  return res.json({ status: "ok" });
}

export async function getProducts(req: Request, res: Response) {
  const where = req.query.active === "true" ? { status: "active" } : undefined;
  const rows = await Product.findAll({ where, order: [["createdAt", "DESC"]] });
  return res.json(rows);
}

export async function getProductById(req: Request, res: Response) {
  const id = String(req.params.id);
  const row = await Product.findByPk(id);
  if (!row) return res.status(404).json({ message: "Product not found" });
  return res.json(row);
}

export async function getReviews(req: Request, res: Response) {
  const rows = await Review.findAll({ where: { status: "approved" }, order: [["createdAt", "DESC"]] });
  return res.json(rows);
}

export async function getFaqs(req: Request, res: Response) {
  const rows = await Faq.findAll({ order: [["sortOrder", "ASC"], ["id", "ASC"]] });
  return res.json(rows);
}

export async function getGallery(req: Request, res: Response) {
  const rows = await Gallery.findAll({ order: [["createdAt", "DESC"]] });
  return res.json(rows);
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
  const total = body.items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);

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
    await OrderItem.create({
      id: randomUUID(),
      orderId: id,
      productId: item.id,
      productName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
    });
  }

  return res.status(201).json({ id, message: "Order placed successfully" });
}
