import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/client/cart.controller";

router.get("/", controller.index);
router.post("/add/:productId", controller.addPost);
router.get("/delete/:productId", controller.deleteItem);

export const cartRoutes: Router = router;
