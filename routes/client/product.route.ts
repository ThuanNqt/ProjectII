import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/product.controller";

router.get("/", controller.index);

export const productRoutes: Router = router;
