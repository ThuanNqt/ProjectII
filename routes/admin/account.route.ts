import { Express, Router } from "express";
const router: Router = Router();
const multer = require("multer");
import * as controller from "../../controllers/admin/account.controller";
const upload = multer();
import * as uploadCloud from "../../middlewares/admin/uploadCloud.middleware";
import * as validate from "../../validates/admin/account.validate";

router.get("/", controller.index);

// Router create
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

export const accountRoutes: Router = router;
