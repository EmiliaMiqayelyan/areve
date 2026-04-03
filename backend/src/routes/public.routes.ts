import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  createContact,
  createOrder,
  getFaqs,
  getGallery,
  getHealth,
  getProductById,
  getProducts,
  getReviews,
} from "../controllers/public.controller";
import { validateBody } from "../middlewares/validate";
import { contactSchema, orderSchema } from "../validators/schemas";

const router = Router();

router.get("/health", asyncHandler(getHealth));
router.get("/products", asyncHandler(getProducts));
router.get("/products/:id", asyncHandler(getProductById));
router.get("/reviews", asyncHandler(getReviews));
router.get("/faqs", asyncHandler(getFaqs));
router.get("/gallery", asyncHandler(getGallery));
router.post("/contact", validateBody(contactSchema), asyncHandler(createContact));
router.post("/orders", validateBody(orderSchema), asyncHandler(createOrder));

export default router;
