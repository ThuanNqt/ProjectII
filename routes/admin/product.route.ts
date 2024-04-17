import { Router, Express } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/product.controller";

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.delete("/delete/:id", controller.deleteProduct);
router.get("/create", controller.create);
router.post("/create", controller.createPost);
export const productRoutes: Router = router;
