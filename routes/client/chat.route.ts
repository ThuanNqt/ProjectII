import { Express, Router } from "express";
const router: Router = Router();
import { requireAuth } from "../../middlewares/client/auth.middleware";
import * as controller from "../../controllers/client/chat.controller";

router.get("/", requireAuth, controller.index);

export const chatRoutes: Router = router;
