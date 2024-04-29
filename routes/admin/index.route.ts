import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { productRoutes } from "./product.route";
import { productCategoryRoutes } from "./product-category.route";
import { roleRoutes } from "./role.route";
import { accountRoutes } from "./account.route";
import { authRoutes } from "./auth.route";

export default (app: Express) => {
  app.use("/admin/dashboard", dashboardRoutes);
  app.use("/admin/products", productRoutes);
  app.use("/admin/products-category", productCategoryRoutes);
  app.use("/admin/roles", roleRoutes);
  app.use("/admin/accounts", accountRoutes);
  app.use("/admin/auth", authRoutes);
};
