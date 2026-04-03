import { Router } from "express";
import {
  createAdminGallery,
  createAdminProduct,
  createAdminReview,
  deleteAdminGallery,
  deleteAdminProduct,
  deleteAdminReview,
  getAdminFaqs,
  getAdminGallery,
  getAdminOrderById,
  getAdminOrders,
  getAdminProducts,
  getAdminReviews,
  getAdminSettings,
  getAdminUsers,
  replaceAdminFaqs,
  updateAdminOrderStatus,
  updateAdminProduct,
  updateAdminReview,
  updateAdminSettings,
} from "../controllers/admin.controller";
import { requireAdminAuth } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { faqSchema, gallerySchema, orderStatusSchema, productSchema, reviewSchema, settingsSchema } from "../validators/schemas";

const router = Router();

router.use(requireAdminAuth);

router.get("/admin/products", asyncHandler(getAdminProducts));
router.post("/admin/products", validateBody(productSchema), asyncHandler(createAdminProduct));
router.put("/admin/products/:id", validateBody(productSchema.partial()), asyncHandler(updateAdminProduct));
router.delete("/admin/products/:id", asyncHandler(deleteAdminProduct));

router.get("/admin/reviews", asyncHandler(getAdminReviews));
router.post("/admin/reviews", validateBody(reviewSchema), asyncHandler(createAdminReview));
router.put("/admin/reviews/:id", validateBody(reviewSchema.partial()), asyncHandler(updateAdminReview));
router.delete("/admin/reviews/:id", asyncHandler(deleteAdminReview));

router.get("/admin/orders", asyncHandler(getAdminOrders));
router.get("/admin/orders/:id", asyncHandler(getAdminOrderById));
router.patch("/admin/orders/:id/status", validateBody(orderStatusSchema), asyncHandler(updateAdminOrderStatus));

router.get("/admin/faqs", asyncHandler(getAdminFaqs));
router.put("/admin/faqs", asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body)) return res.status(400).json({ message: "Expected FAQ array" });
  req.body.forEach((item) => faqSchema.parse(item));
  return replaceAdminFaqs(req, res);
}));

router.get("/admin/gallery", asyncHandler(getAdminGallery));
router.post("/admin/gallery", validateBody(gallerySchema), asyncHandler(createAdminGallery));
router.delete("/admin/gallery/:id", asyncHandler(deleteAdminGallery));

router.get("/admin/settings", asyncHandler(getAdminSettings));
router.put("/admin/settings", validateBody(settingsSchema), asyncHandler(updateAdminSettings));

router.get("/admin/users", asyncHandler(getAdminUsers));

export default router;
