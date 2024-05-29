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

// Router delete
router.delete("/delete/:id", controller.deleteAccount);

// Route change status
// Truyền data động thì có : ở trước tên biến
router.patch("/change-status/:status/:id", controller.changeStatus);

//[GET] /admin/accounts/detail/:id
router.get("/detail/:id", controller.detail);

//Route update account
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

export const accountRoutes: Router = router;
