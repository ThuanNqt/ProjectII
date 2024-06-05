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
exports.category = exports.detail = exports.index = void 0;
const product_model_1 = __importDefault(require("../../models/product.model"));
const product_category_model_1 = __importDefault(require("../../models/product-category.model"));
const product_1 = require("../../helpers/product");
const product_category_1 = require("../../helpers/product-category");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        status: "active",
        deleted: false,
    };
    const sort = {};
    if (typeof req.query.sortKey === "string" &&
        typeof req.query.sortValue === "string") {
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[sortKey] = sortValue;
    }
    else {
        sort.title = "asc";
    }
    const products = yield product_model_1.default.find(find).sort(sort);
    const newProducts = (0, product_1.priceNewProducts)(products);
    if (sort) {
        newProducts.sort((a, b) => {
            if (sort["price"] === "desc") {
                return b.newPrice - a.newPrice;
            }
            else if (sort["price"] === "asc") {
                return a.newPrice - b.newPrice;
            }
        });
    }
    let productsRange = newProducts;
    if (req.query.priceMin || req.query.priceMax) {
        const priceMin = parseInt(req.query.priceMin);
        const priceMax = parseInt(req.query.priceMax);
        productsRange = newProducts.filter((product) => {
            return product.newPrice >= priceMin && product.newPrice <= priceMax;
        });
    }
    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: productsRange,
    });
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.params.slugProduct;
        const find = {
            deleted: false,
            slug: slug,
            status: "active",
        };
        const product = yield product_model_1.default.findOne(find);
        if (product.product_category_id) {
            const category = yield product_category_model_1.default.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false,
            });
            product.category = category;
        }
        product.newPrice = parseInt(yield (0, product_1.priceNewProduct)(product));
        res.render(`client/pages/products/detail`, {
            pageTitle: product.title,
            product: product,
        });
    }
    catch (error) {
        res.redirect(`/products`);
    }
});
exports.detail = detail;
const category = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slug = req.params.slugCategory;
        const findSlugCategory = {
            slug: slug,
            deleted: false,
            status: "active",
        };
        const category = yield product_category_model_1.default.findOne(findSlugCategory).exec();
        const productCategory = yield (0, product_category_1.getSubCategory)(category.id);
        const productCategoryIds = productCategory.map((item) => item.id);
        const products = yield product_model_1.default.find({
            deleted: false,
            status: "active",
            product_category_id: { $in: [category.id, ...productCategoryIds] },
        }).sort({ position: "desc" });
        const newProducts = yield (0, product_1.priceNewProducts)(products);
        res.render("client/pages/products/index", {
            pageTitle: category.title,
            products: newProducts,
        });
    }
    catch (error) {
        res.redirect(`/products`);
    }
});
exports.category = category;
