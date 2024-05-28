"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_route_1 = require("./dashboard.route");
const product_route_1 = require("./product.route");
const product_category_route_1 = require("./product-category.route");
const role_route_1 = require("./role.route");
const account_route_1 = require("./account.route");
const auth_route_1 = require("./auth.route");
const authMiddleware = __importStar(require("../../middlewares/admin/auth.middleware"));
exports.default = (app) => {
    app.use("/admin/dashboard", authMiddleware.requireAuth, dashboard_route_1.dashboardRoutes);
    app.use("/admin/products", authMiddleware.requireAuth, product_route_1.productRoutes);
    app.use("/admin/products-category", authMiddleware.requireAuth, product_category_route_1.productCategoryRoutes);
    app.use("/admin/roles", authMiddleware.requireAuth, role_route_1.roleRoutes);
    app.use("/admin/accounts", authMiddleware.requireAuth, account_route_1.accountRoutes);
    app.use("/admin/auth", auth_route_1.authRoutes);
};
