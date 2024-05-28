"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const home_route_1 = require("./home.route");
const product_route_1 = require("./product.route");
const search_route_1 = require("./search.route");
const cart_route_1 = require("./cart.route");
const checkout_route_1 = require("./checkout.route");
const user_route_1 = require("./user.route");
const category_middleware_1 = require("../../middlewares/client/category.middleware");
const cart_middleware_1 = require("../../middlewares/client/cart.middleware");
const user_middleware_1 = require("../../middlewares/client/user.middleware");
exports.default = (app) => {
    app.use(category_middleware_1.category);
    app.use(cart_middleware_1.cartId);
    app.use(user_middleware_1.infoUser);
    app.use("/", home_route_1.homeRoutes);
    app.use("/products", product_route_1.productRoutes);
    app.use("/search", search_route_1.searchRoutes);
    app.use("/cart", cart_route_1.cartRoutes);
    app.use("/checkout", checkout_route_1.checkoutRoutes);
    app.use("/user", user_route_1.userRoutes);
};
