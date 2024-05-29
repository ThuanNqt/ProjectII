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
const product_model_1 = __importDefault(require("../../models/product.model"));
const product_1 = require("../../helpers/product");
const limitItem = 12;
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findProductsFeatured = {
        featured: "1",
        deleted: false,
        status: "active",
    };
    const productsFeatured = yield product_model_1.default.find(findProductsFeatured).limit(limitItem);
    const newProductsFeatured = (0, product_1.priceNewProducts)(productsFeatured);
    const findProductsNew = {
        deleted: false,
        status: "active",
    };
    const productsNew = yield product_model_1.default.find(findProductsNew).limit(limitItem);
    const newProductsNew = (0, product_1.priceNewProducts)(productsNew);
    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew,
    });
});
exports.index = index;
