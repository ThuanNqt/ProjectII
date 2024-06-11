import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/order.controller";

//Routes home
router.get("/", controller.index);

export const orderRoutes: Router = router;
