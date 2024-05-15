import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/client/user.controller";
import * as validate from "../../validates/client/user.validate";
import { requireAuth } from "../../middlewares/client/auth.middleware";

router.get("/register", controller.register);

router.post("/register", validate.registerPost, controller.registerPost);

router.get("/login", controller.login);
router.post("/login", validate.loginPost, controller.loginPost);

router.get("/logout", controller.logout);

router.get("/info", requireAuth, controller.info);

export const userRoutes: Router = router;
