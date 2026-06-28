import {
  createAdminGallery,
  createAdminProduct,
  createAdminCategory,
  createAdminReview,
  deleteAdminGallery,
  deleteAdminProduct,
  deleteAdminCategory,
  deleteAdminReview,
  getAdminCategories,
  getAdminFaqs,
  getAdminGallery,
  getAdminOrderById,
  getAdminOrders,
  getAdminProducts,
  getAdminReviews,
  getAdminSettings,
  getAdminUsers,
  replaceAdminFaqs,
  updateAdminOrder,
  updateAdminOrderStatus,
  updateAdminProduct,
  updateAdminCategory,
  updateAdminReview,
  updateAdminSettings,
  createAdminOrder,
  deleteAdminOrder,
} from "../controllers/admin.controller";
import { getAdminAccount, updateAdminCredentials } from "../controllers/auth.controller";
import { requireAdminAuth } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import {
  adminCredentialsUpdateSchema,
  adminOrderCreateSchema,
  adminOrderUpdateSchema,
  categoryCreateSchema,
  categoryUpdateSchema,
  faqReplaceSchema,
  gallerySchema,
  orderSchema,
  orderStatusSchema,
  productCreateSchema,
  productSchema,
  reviewCreateSchema,
  reviewSchema,
  settingsSchema,
} from "../validators/schemas";

const router = Router();

router.use(requireAdminAuth);

router.get("/admin/account", asyncHandler(getAdminAccount));
router.put(
  "/admin/account/credentials",
  validateBody(adminCredentialsUpdateSchema),
  asyncHandler(updateAdminCredentials)
);

router.get("/admin/products", asyncHandler(getAdminProducts));
router.post("/admin/products", validateBody(productCreateSchema), asyncHandler(createAdminProduct));
router.put("/admin/products/:id", validateBody(productSchema.partial()), asyncHandler(updateAdminProduct));
router.delete("/admin/products/:id", asyncHandler(deleteAdminProduct));

router.get("/admin/reviews", asyncHandler(getAdminReviews));
router.post("/admin/reviews", validateBody(reviewCreateSchema), asyncHandler(createAdminReview));
router.put("/admin/reviews/:id", validateBody(reviewSchema.partial()), asyncHandler(updateAdminReview));
router.delete("/admin/reviews/:id", asyncHandler(deleteAdminReview));

router.get("/admin/orders", asyncHandler(getAdminOrders));
router.post("/admin/orders", validateBody(adminOrderCreateSchema), asyncHandler(createAdminOrder));
router.get("/admin/orders/:id", asyncHandler(getAdminOrderById));
router.put("/admin/orders/:id", validateBody(adminOrderUpdateSchema), asyncHandler(updateAdminOrder));
router.patch("/admin/orders/:id/status", validateBody(orderStatusSchema), asyncHandler(updateAdminOrderStatus));
router.delete("/admin/orders/:id", asyncHandler(deleteAdminOrder));

router.get("/admin/faqs", asyncHandler(getAdminFaqs));
router.put("/admin/faqs", validateBody(faqReplaceSchema), asyncHandler(replaceAdminFaqs));

router.get("/admin/gallery", asyncHandler(getAdminGallery));
router.post("/admin/gallery", validateBody(gallerySchema), asyncHandler(createAdminGallery));
router.delete("/admin/gallery/:id", asyncHandler(deleteAdminGallery));

router.get("/admin/categories", asyncHandler(getAdminCategories));
router.post("/admin/categories", validateBody(categoryCreateSchema), asyncHandler(createAdminCategory));
router.put("/admin/categories/:id", validateBody(categoryUpdateSchema), asyncHandler(updateAdminCategory));
router.delete("/admin/categories/:id", asyncHandler(deleteAdminCategory));

router.get("/admin/settings", asyncHandler(getAdminSettings));
router.put("/admin/settings", validateBody(settingsSchema), asyncHandler(updateAdminSettings));

router.get("/admin/users", asyncHandler(getAdminUsers));

export default router;
