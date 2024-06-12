import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/order.controller";

//Routes order
router.get("/", controller.index);

router.post("/process-shipping", controller.orderShipping);

export const orderRoutes: Router = router;
