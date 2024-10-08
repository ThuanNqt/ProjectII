import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/client/user.controller";
import * as validate from "../../validates/client/user.validate";
import { requireAuth } from "../../middlewares/client/auth.middleware";

router.get("/register", controller.register);

router.post("/register", validate.registerPost, controller.registerPost);

router.get("/login", controller.login);
router.post("/login", validate.loginPost, controller.loginPost);

router.get("/logout", controller.logout);

router.get("/info", requireAuth, controller.info);

router.get("/password/forgot", controller.forgotPassword);
router.post(
  "/password/forgot",
  validate.forgotPasswordPost,
  controller.forgotPasswordPost
);

router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);

router.get("/password/reset", controller.resetPassword);
router.post(
  "/password/reset",
  validate.resetPasswordPost,
  controller.resetPasswordPost
);

// Edit info
router.get("/editInfo", requireAuth, controller.editInfo);
router.patch(
  "/editInfo",
  requireAuth,
  validate.registerPost,
  controller.editInfoPatch
);

// Rating order
router.get("/order-rating/:order_id", requireAuth, controller.orderRating);
router.post("/order-rating", requireAuth, controller.orderRatingPost);

// Cancel order
router.delete(
  "/order-cancel/:order_id",
  requireAuth,
  controller.orderCancelDelete
);

export const userRoutes: Router = router;
