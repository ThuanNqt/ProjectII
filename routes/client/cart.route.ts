import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/client/cart.controller";

router.get("/", controller.index);
router.post("/add/:productId", controller.addPost);

export const cartRoutes: Router = router;
