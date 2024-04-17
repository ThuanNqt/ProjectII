import { Express } from "express";
import { dashboardRoutes } from "./dashboard.route";
import { productRoutes } from "./product.route";
import { productCategoryRoutes } from "./product-category.route";

export default (app: Express) => {
  app.use("/admin/dashboard", dashboardRoutes);
  app.use("/admin/products", productRoutes);
  app.use("/admin/products-category", productCategoryRoutes);
};
