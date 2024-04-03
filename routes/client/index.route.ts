import { Express } from "express";
import { homeRoutes } from "./home.route";
import { productRoutes } from "./product.route";

export default (app: Express): void => {
  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
};
