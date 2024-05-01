import { Express, Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/client/search.controller";

router.get("/", controller.index);

export const searchRoutes: Router = router;
