import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { productRoutes } from "./product.route";
import { productCategoryRoutes } from "./product-category.route";
import { roleRoutes } from "./role.route";
import { accountRoutes } from "./account.route";
import { authRoutes } from "./auth.route";
import { orderRoutes } from "./order.route";
import * as authMiddleware from "../../middlewares/admin/auth.middleware";

export default (app: Express) => {
  app.use("/admin/dashboard", authMiddleware.requireAuth, dashboardRoutes);
  app.use("/admin/products", authMiddleware.requireAuth, productRoutes);
  app.use(
    "/admin/products-category",
    authMiddleware.requireAuth,
    productCategoryRoutes
  );
  app.use("/admin/roles", authMiddleware.requireAuth, roleRoutes);
  app.use("/admin/accounts", authMiddleware.requireAuth, accountRoutes);
  app.use("/admin/auth", authRoutes);
  app.use("/admin/order", authMiddleware.requireAuth, orderRoutes);
};
