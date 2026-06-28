import { Gallery, Order, OrderItem, Product, Review } from "../models";
import type { Locale } from "./localizedText";
import { parseLocalized, pickLocalized } from "./localizedText";

type JsonRecord = Record<string, unknown>;

type FormatOptions = {
  locale?: Locale;
  /** Admin API: return { hy, en } objects instead of resolved strings. */
  bilingual?: boolean;
};

function asRecord(value: unknown): JsonRecord {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as JsonRecord;
  }
  return {};
}

function formatLocalizedField(value: unknown, opts?: FormatOptions) {
  if (opts?.bilingual) return parseLocalized(value);
  return pickLocalized(value, opts?.locale ?? "hy");
}

export function formatProduct(product: Product | JsonRecord, opts?: FormatOptions) {
  const j =
    typeof (product as Product).toJSON === "function"
      ? ((product as Product).toJSON() as JsonRecord)
      : asRecord(product);

  return {
    id: j.id,
    name: formatLocalizedField(j.name, opts),
    price: Number(j.price ?? 0),
    cost: Number(j.cost ?? 0),
    image: j.image,
    category: j.category,
    badge: j.badge != null ? formatLocalizedField(j.badge, opts) : null,
    description: j.description != null ? formatLocalizedField(j.description, opts) : null,
    status: j.status ?? "active",
    createdAt: j.createdAt ?? j.created_at ?? null,
  };
}

export function formatReview(review: Review | JsonRecord, opts?: FormatOptions) {
  const j =
    typeof (review as Review).toJSON === "function"
      ? ((review as Review).toJSON() as JsonRecord)
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

export function formatFaq(faq: JsonRecord, opts?: FormatOptions) {
  return {
    id: faq.id,
    question: formatLocalizedField(faq.question, opts),
    answer: formatLocalizedField(faq.answer, opts),
    sortOrder: faq.sortOrder ?? faq.sort_order ?? 0,
  };
}

export function formatCategory(category: JsonRecord, opts?: FormatOptions) {
  return {
    id: category.id,
    name: formatLocalizedField(category.name, opts),
    sortOrder: category.sortOrder ?? category.sort_order ?? 0,
  };
}

export function formatGalleryItem(item: Gallery | JsonRecord, opts?: FormatOptions) {
  const j =
    typeof (item as Gallery).toJSON === "function"
      ? ((item as Gallery).toJSON() as JsonRecord)
      : asRecord(item);

  return {
    id: j.id,
    src: j.src,
    alt: formatLocalizedField(j.alt, opts),
    cols: Number(j.cols ?? 1),
    createdAt: j.createdAt ?? j.created_at ?? null,
  };
}

export function formatOrderItem(item: OrderItem | JsonRecord) {
  const j =
    typeof (item as OrderItem).toJSON === "function"
      ? ((item as OrderItem).toJSON() as JsonRecord)
      : asRecord(item);

  return {
    id: String(j.productId ?? j.product_id ?? ""),
    name: String(j.productName ?? j.product_name ?? ""),
    quantity: Number(j.quantity ?? 0),
    price: Number(j.unitPrice ?? j.unit_price ?? 0),
    unitCost: Number(j.unitCost ?? j.unit_cost ?? 0),
  };
}

export function formatOrder(order: Order | JsonRecord) {
  const j =
    typeof (order as Order).toJSON === "function"
      ? ((order as Order).toJSON() as JsonRecord)
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
    items: rawItems.map((item) => formatOrderItem(item as OrderItem | JsonRecord)),
  };
}

export function formatSettings(row: JsonRecord) {
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

export function resolveRequestLocale(req: { query: Record<string, unknown> }): Locale {
  const raw = String(req.query.locale ?? "hy");
  return raw === "en" ? "en" : "hy";
}
