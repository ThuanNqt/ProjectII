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
exports.userRoutes = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
const controller = __importStar(require("../../controllers/client/user.controller"));
const validate = __importStar(require("../../validates/client/user.validate"));
const auth_middleware_1 = require("../../middlewares/client/auth.middleware");
router.get("/register", controller.register);
router.post("/register", validate.registerPost, controller.registerPost);
router.get("/login", controller.login);
router.post("/login", validate.loginPost, controller.loginPost);
router.get("/logout", controller.logout);
router.get("/info", auth_middleware_1.requireAuth, controller.info);
router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot", validate.forgotPasswordPost, controller.forgotPasswordPost);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);
router.get("/password/reset", controller.resetPassword);
router.post("/password/reset", validate.resetPasswordPost, controller.resetPasswordPost);
router.get("/editInfo", auth_middleware_1.requireAuth, controller.editInfo);
router.patch("/editInfo", auth_middleware_1.requireAuth, validate.registerPost, controller.editInfoPatch);
router.get("/order-rating/:order_id", auth_middleware_1.requireAuth, controller.orderRating);
router.post("/order-rating", auth_middleware_1.requireAuth, controller.orderRatingPost);
router.delete("/order-cancel/:order_id", auth_middleware_1.requireAuth, controller.orderCancelDelete);
exports.userRoutes = router;
