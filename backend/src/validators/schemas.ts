import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2).max(120),
  price: z.number().positive(),
  image: z.string().min(1),
  category: z.enum(["bags", "toys", "accessories"]),
  badge: z.string().max(40).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const reviewSchema = z.object({
  name: z.string().min(2).max(120),
  location: z.string().max(120).optional().nullable(),
  product: z.string().min(2).max(120),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(1500),
  status: z.enum(["approved", "pending", "rejected"]).default("pending"),
});

export const faqSchema = z.object({
  question: z.string().min(5).max(400),
  answer: z.string().min(5).max(3000),
});

export const gallerySchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(2).max(180),
  cols: z.number().int().min(1).max(2),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  message: z.string().min(10).max(3000),
});

export const orderSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(120),
  lastName: z.string().min(1).max(120),
  address: z.string().min(5).max(255),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(100),
  zipCode: z.string().min(1).max(30),
  items: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(120),
        quantity: z.number().int().min(1),
        price: z.number().positive(),
      })
    )
    .min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "shipped", "delivered"]),
});

export const settingsSchema = z.object({
  storeName: z.string().min(1).max(120),
  tagline: z.string().max(240),
  footerDescription: z.string().max(2000),
  supportEmail: z.string().email(),
  businessPhone: z.string().max(50),
  address: z.string().max(255),
  instagramUrl: z.string().url(),
  facebookUrl: z.string().url(),
  whatsappUrl: z.string().url(),
});
