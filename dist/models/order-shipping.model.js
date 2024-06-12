"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderShippingSchema = new mongoose_1.default.Schema({
    order_id: String,
    shipName: String,
    shipPhone: String,
}, {
    timestamps: true,
});
const OrderShipping = mongoose_1.default.model("OrderShipping", orderShippingSchema, "order-shipping");
exports.default = OrderShipping;
