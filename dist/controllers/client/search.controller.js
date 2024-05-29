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
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const keyword = typeof req.query.keyword === "string" ? req.query.keyword : "";
    let newProducts = [];
    if (keyword) {
        const keywordRegex = new RegExp(keyword, "i");
        const products = yield product_model_1.default.find({
            title: keywordRegex,
            status: "active",
            deleted: false,
        });
        newProducts = (yield (0, product_1.priceNewProducts)(products));
    }
    res.render("client/pages/search/index", {
        pageTitle: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProducts,
    });
});
exports.index = index;
