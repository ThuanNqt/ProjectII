import { Router, Express } from "express";
const router: Router = Router();
import * as controller from "../../controllers/admin/role.controller";

router.get("/", controller.index);

// Route delete
router.delete("/delete/:id", controller.deleteRole);

//Route detail
router.get("/detail/:id", controller.detail);

//Route edit
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", controller.editPatch);

// Route create
router.get("/create", controller.create);
router.post("/create", controller.createPost);

//Route permissions
router.get("/permissions", controller.permissions);
router.patch("/permissions", controller.permissionsPatch);

export const roleRoutes: Router = router;
