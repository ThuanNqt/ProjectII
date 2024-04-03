import { Router, Request, Response } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/dashboard.controller";

router.get("/", controller.dashboard);

export const dashboardRoutes: Router = router;
