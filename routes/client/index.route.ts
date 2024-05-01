import { Express } from "express";
import { homeRoutes } from "./home.route";
import { productRoutes } from "./product.route";
import { searchRoutes } from "./search.route";
import { category } from "../../middlewares/client/category.middleware";

export default (app: Express): void => {
  app.use(category); //Luôn luôn gọi mới middleware trước khi gọi route
  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
  app.use("/search", searchRoutes);
};
