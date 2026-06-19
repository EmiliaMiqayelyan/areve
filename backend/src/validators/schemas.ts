import { z } from "zod";
import { normalizeLocalizedInput } from "../utils/localizedText";

const optionalUrlOrEmpty = z.union([z.string().url(), z.literal("")]).optional();

const localizedTextSchema = z
  .union([
    z.string().min(1).max(5000),
    z.object({
      hy: z.string().min(1).max(5000),
      en: z.string().max(5000).optional(),
    }),
  ])
  .transform(normalizeLocalizedInput);

const optionalLocalizedTextSchema = z
  .union([
    z.string().max(5000),
    z.object({
      hy: z.string().max(5000).optional(),
      en: z.string().max(5000).optional(),
    }),
    z.null(),
  ])
  .optional()
  .nullable()
  .transform((value) => {
    if (value == null || value === "") return null;
    const normalized = normalizeLocalizedInput(value);
    if (!normalized.hy && !normalized.en) return null;
    return normalized;
  });

export const productSchema = z.object({
  name: localizedTextSchema,
  price: z.coerce.number().positive(),
  image: z.string().min(1),
  category: z.enum(["bags", "toys", "accessories"]),
  badge: optionalLocalizedTextSchema,
  description: optionalLocalizedTextSchema,
  status: z.enum(["active", "inactive"]).default("active"),
});

export const productCreateSchema = productSchema.extend({
  id: z.string().min(1).max(64).optional(),
});

export const reviewSchema = z.object({
  name: z.string().min(2).max(120),
  location: z.string().max(120).optional().nullable(),
  product: localizedTextSchema,
  rating: z.coerce.number().int().min(1).max(5),
  comment: localizedTextSchema,
  status: z.enum(["approved", "pending", "rejected"]).default("pending"),
});

export const reviewCreateSchema = reviewSchema.extend({
  id: z.string().min(1).max(64).optional(),
});

export const faqSchema = z.object({
  question: localizedTextSchema,
  answer: localizedTextSchema,
});

export const gallerySchema = z.object({
  id: z.string().min(1).max(64).optional(),
  src: z.string().min(1),
  alt: localizedTextSchema,
  cols: z.coerce.number().int().min(1).max(2),
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

/** Admin dashboard order edits (customer/shipping fields). */
export const adminOrderUpdateSchema = z.object({
  customerName: z.string().min(1).max(160).optional(),
  customerEmail: z.string().email().optional(),
  address: z.string().min(1).max(255).optional(),
  city: z.string().min(1).max(100).optional(),
  state: z.string().min(1).max(100).optional(),
  zipCode: z.string().min(1).max(30).optional(),
  status: z.enum(["pending", "shipped", "delivered"]).optional(),
  total: z.coerce.number().nonnegative().optional(),
  items: z
    .array(
      z.object({
        id: z.string().optional(),
        productId: z.string().optional(),
        name: z.string().min(1).max(120).optional(),
        productName: z.string().min(1).max(120).optional(),
        quantity: z.coerce.number().int().min(1),
        price: z.coerce.number().positive().optional(),
        unitPrice: z.coerce.number().positive().optional(),
      })
    )
    .optional(),
});

export const faqReplaceSchema = z.array(
  z.object({
    id: z.string().optional(),
    question: localizedTextSchema,
    answer: localizedTextSchema,
  })
);

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
  tiktokUrl: optionalUrlOrEmpty,
  youtubeUrl: optionalUrlOrEmpty,
  siteContent: z.any().optional(),
});
