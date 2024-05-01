import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/client/cart.controller";

router.get("/", controller.index);
router.post("/add/:productId", controller.addPost);
router.get("/delete/:productId", controller.deleteItem);
router.get("/update/:productId/:quantity", controller.updateQuantity);

export const cartRoutes: Router = router;
