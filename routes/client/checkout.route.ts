import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/checkout.controller";

//Routes home
router.get("/", controller.index);

router.post("/order", controller.order);

router.get("/success/:orderId", controller.success);

export const checkoutRoutes: Router = router;
