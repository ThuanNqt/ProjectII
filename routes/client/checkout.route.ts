import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/checkout.controller";

//Routes home
router.get("/", controller.index);

export const checkoutRoutes: Router = router;
