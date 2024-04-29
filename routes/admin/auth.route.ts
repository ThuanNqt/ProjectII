import { Express, Router } from "express";
const router: Router = Router();
import * as validate from "../../validates/admin/auth.validate";
import * as controller from "../../controllers/admin/auth.controller";

router.get("/login", controller.login);

router.post("/login", validate.loginPost, controller.loginPost);

// Route logout
router.get("/logout", controller.logout);

export const authRoutes: Router = router;
