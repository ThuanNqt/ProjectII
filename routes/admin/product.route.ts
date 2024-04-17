import { Router, Express } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/product.controller";
import multer from "multer";
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.delete("/delete/:id", controller.deleteProduct);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.createPost
);
export const productRoutes: Router = router;
