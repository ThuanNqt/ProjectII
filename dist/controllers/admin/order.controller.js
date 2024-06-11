"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const order_model_1 = __importDefault(require("../../models/order.model"));
const product_model_1 = __importDefault(require("../../models/product.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.default.find();
    for (const order of orders) {
        let totalPriceOrder = 0, totalQuantityOfOrder = 0;
        for (const product of order.products) {
            product.productInfo = yield product_model_1.default.findOne({
                _id: product.product_id,
            });
            product.newPrice = Math.floor(product.price * (1 - product.discountPercentage / 100));
            product.totalPriceProduct = product.newPrice * product.quantity;
            totalPriceOrder += product.totalPriceProduct;
            totalQuantityOfOrder += product.quantity;
        }
        order.totalPriceOrder = totalPriceOrder;
        order.totalQuantityOfOrder = totalQuantityOfOrder;
    }
    res.render("admin/pages/orders/index", {
        orders,
    });
});
exports.index = index;
