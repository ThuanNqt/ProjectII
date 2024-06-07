import { Router } from "express";
const router: Router = Router();
import { requireAuth } from "../../middlewares/client/auth.middleware";
import * as controller from "../../controllers/client/cart.controller";

router.get("/", controller.index);
router.post("/add/:productId", requireAuth, controller.addPost);
router.get("/delete/:productId", requireAuth, controller.deleteItem);
router.get(
  "/update/:productId/:quantity",
  requireAuth,
  controller.updateQuantity
);

export const cartRoutes: Router = router;
