"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    cart_id: String,
    userInfo: {
        fullName: String,
        phone: String,
        address: String,
    },
    products: [
        {
            product_id: String,
            quantity: Number,
            price: Number,
            discountPercentage: Number,
        },
    ],
    paymentType: String,
    payment: Boolean,
    deleted: {
        type: Boolean,
        default: false,
    },
    status: String,
}, {
    timestamps: true,
});
const Order = mongoose_1.default.model("Order", orderSchema, "orders");
exports.default = Order;
