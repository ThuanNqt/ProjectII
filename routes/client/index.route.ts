import { Express } from "express";
import { homeRoutes } from "./home.route";
import { productRoutes } from "./product.route";
import { searchRoutes } from "./search.route";
import { cartRoutes } from "./cart.route";
import { checkoutRoutes } from "./checkout.route";
import { userRoutes } from "./user.route";
import { category } from "../../middlewares/client/category.middleware";
import { cartId } from "../../middlewares/client/cart.middleware";
import { infoUser } from "../../middlewares/client/user.middleware";

export default (app: Express): void => {
  app.use(category); //Luôn luôn gọi mới middleware trước khi gọi route
  app.use(infoUser);
  app.use(cartId);
  app.use("/", homeRoutes);
  app.use("/products", productRoutes);
  app.use("/search", searchRoutes);
  app.use("/cart", cartRoutes);
  app.use("/checkout", checkoutRoutes);
  app.use("/user", userRoutes);
};
