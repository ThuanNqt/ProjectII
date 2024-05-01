import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/product.controller";

// Routes home
router.get("/", controller.index);

// Routes detail
router.get("/detail/:slugProduct", controller.detail);

//Routes category
router.get("/:slugCategory", controller.category);

export const productRoutes: Router = router;
