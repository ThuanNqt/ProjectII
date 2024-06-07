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
exports.checkoutRoutes = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
const controller = __importStar(require("../../controllers/client/checkout.controller"));
const auth_middleware_1 = require("../../middlewares/client/auth.middleware");
router.get("/", controller.index);
router.post("/order", auth_middleware_1.requireAuth, controller.order);
router.post("/create_payment_url", auth_middleware_1.requireAuth, controller.createPaymentUrl);
router.get("/vnpay_return", auth_middleware_1.requireAuth, controller.vnpayReturn);
router.get("/vnpay_ipn", auth_middleware_1.requireAuth, controller.vnpayIpn);
router.get("/success/:orderId", auth_middleware_1.requireAuth, controller.success);
exports.checkoutRoutes = router;
