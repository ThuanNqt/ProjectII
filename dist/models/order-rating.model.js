"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderRatingSchema = new mongoose_1.default.Schema({
    user_id: String,
    order_id: String,
    products: {
        product_id: String,
        rating: Number,
        comment: String,
    },
}, {
    timestamps: true,
});
const OrderRating = mongoose_1.default.model("OrderRating", orderRatingSchema, "order-rating");
exports.default = OrderRating;
