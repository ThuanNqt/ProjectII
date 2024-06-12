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
exports.orderShipping = exports.index = void 0;
const order_model_1 = __importDefault(require("../../models/order.model"));
const product_model_1 = __importDefault(require("../../models/product.model"));
const order_shipping_model_1 = __importDefault(require("../../models/order-shipping.model"));
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
        orders: orders.reverse(),
    });
});
exports.index = index;
const orderShipping = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.default.findOne({ _id: req.body.order_id });
        if (!order) {
            req.flash("error", "Đơn hàng không tồn tại");
            res.redirect("back");
            return;
        }
        yield order_model_1.default.updateOne({ _id: req.body.order_id }, { status: "shipping" });
        const shipperInfo = new order_shipping_model_1.default(req.body);
        yield shipperInfo.save();
        req.flash("success", "Đơn hàng đã được gửi");
        res.redirect("back");
    }
    catch (error) {
        req.flash("error", "Có lỗi xảy ra");
        res.redirect("back");
    }
});
exports.orderShipping = orderShipping;
