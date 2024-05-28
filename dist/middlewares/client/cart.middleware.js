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
exports.cartId = void 0;
const cart_model_1 = __importDefault(require("../../models/cart.model"));
const cartId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = res.locals.user;
    if (!req.cookies.cartId) {
        let cart;
        if (user) {
            cart = yield cart_model_1.default.findOne({ user_id: user.id });
            if (!cart) {
                cart = new cart_model_1.default({ user_id: user.id });
                yield cart.save();
            }
        }
        else {
            cart = new cart_model_1.default();
            yield cart.save();
        }
        const expiresTime = 1000 * 60 * 60 * 24 * 365;
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime),
            httpOnly: true,
        });
    }
    else {
        const cart = yield cart_model_1.default.findOne({ _id: req.cookies.cartId });
        if (cart) {
            cart.totalQuantity = cart.products.reduce((total, item) => total + item.quantity, 0);
            res.locals.miniCart = cart;
        }
        else {
            res.locals.miniCart = { products: [], totalQuantity: 0 };
        }
    }
    next();
});
exports.cartId = cartId;
