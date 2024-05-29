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
exports.updateQuantity = exports.deleteItem = exports.addPost = exports.index = void 0;
const cart_model_1 = __importDefault(require("../../models/cart.model"));
const product_model_1 = __importDefault(require("../../models/product.model"));
const product_1 = require("../../helpers/product");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield cart_model_1.default.findOne({
        _id: req.cookies.cartId,
    });
    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id;
            const productInfo = yield product_model_1.default.findOne({
                _id: productId,
            });
            const newPrice = parseInt((0, product_1.priceNewProduct)(productInfo));
            productInfo.newPrice = newPrice;
            const totalPrice = newPrice * item.quantity;
            item.totalPrice = totalPrice;
            item.productInfo = productInfo;
        }
    }
    cart.totalPrice = cart.products.reduce((total, item) => {
        return total + item.totalPrice;
    }, 0);
    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart,
    });
});
exports.index = index;
const addPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cart = yield cart_model_1.default.findOne({ _id: cartId });
    const existProductInCart = cart.products.find((item) => item.product_id == productId);
    if (existProductInCart) {
        const newQuantity = existProductInCart.quantity + quantity;
        yield cart_model_1.default.updateOne({
            _id: cartId,
            "products.product_id": productId,
        }, {
            "products.$.quantity": newQuantity,
        });
    }
    else {
        let objectCart = {
            product_id: productId,
            quantity: quantity,
        };
        yield cart_model_1.default.updateOne({
            _id: cartId,
        }, {
            $push: { products: objectCart },
        });
    }
    req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");
    res.redirect("back");
});
exports.addPost = addPost;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartId = req.cookies.cartId;
        const productId = req.params.productId;
        yield cart_model_1.default.updateOne({
            _id: cartId,
        }, {
            $pull: { products: { product_id: productId } },
        });
        req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng");
    }
    catch (error) {
        req.flash("error", "Xóa sản phẩm khỏi giỏ hàng thất bại");
    }
    res.redirect("back");
});
exports.deleteItem = deleteItem;
const updateQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartId = req.cookies.cartId;
        const productId = req.params.productId;
        const quantity = parseInt(req.params.quantity);
        yield cart_model_1.default.updateOne({
            _id: cartId,
            "products.product_id": productId,
        }, {
            "products.$.quantity": quantity,
        });
        req.flash("success", "Thay đổi số lượng thành công");
    }
    catch (error) {
        req.flash("error", "Thay đổi số lượng thất bại");
    }
    res.redirect("back");
});
exports.updateQuantity = updateQuantity;
