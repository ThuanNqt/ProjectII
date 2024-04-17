import { Router, Express } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/product-category.controller";
import multer from "multer";
const upload = multer();
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import * as validate from "../../validates/admin/product-category.validate";

// Home
router.get("/", controller.index);

// Create
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

//Route update product-category
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

// Truyền data động thì có : ở trước tên biến
router.patch("/change-status/:status/:id", controller.changeStatus);

// Route delete product category
router.delete("/delete/:id", controller.deleteItem);

export const productCategoryRoutes: Router = router;
