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
exports.dashboard = void 0;
const product_category_model_1 = __importDefault(require("../../models/product-category.model"));
const product_model_1 = __importDefault(require("../../models/product.model"));
const account_model_1 = __importDefault(require("../../models/account.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const role_model_1 = __importDefault(require("../../models/role.model"));
const order_model_1 = __importDefault(require("../../models/order.model"));
const dashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        role: {
            total: 0,
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        order: {
            total: 0,
            bestSellingProduct: [],
        },
    };
    statistic.categoryProduct.total = yield product_category_model_1.default.countDocuments({
        deleted: false,
    });
    statistic.categoryProduct.active = yield product_category_model_1.default.countDocuments({
        deleted: false,
        status: "active",
    });
    statistic.categoryProduct.inactive = yield product_category_model_1.default.countDocuments({
        deleted: false,
        status: "inactive",
    });
    statistic.product.total = yield product_model_1.default.countDocuments({
        deleted: false,
    });
    statistic.product.active = yield product_model_1.default.countDocuments({
        deleted: false,
        status: "active",
    });
    statistic.product.inactive = yield product_model_1.default.countDocuments({
        deleted: false,
        status: "inactive",
    });
    statistic.role.total = yield role_model_1.default.countDocuments({
        deleted: false,
    });
    statistic.account.total = yield account_model_1.default.countDocuments({
        deleted: false,
    });
    statistic.account.active = yield account_model_1.default.countDocuments({
        deleted: false,
        status: "active",
    });
    statistic.account.inactive = yield account_model_1.default.countDocuments({
        deleted: false,
        status: "inactive",
    });
    statistic.user.total = yield user_model_1.default.countDocuments({
        deleted: false,
    });
    statistic.user.active = yield user_model_1.default.countDocuments({
        deleted: false,
        status: "active",
    });
    statistic.user.inactive = yield user_model_1.default.countDocuments({
        deleted: false,
        status: "inactive",
    });
    statistic.order.total = yield order_model_1.default.countDocuments();
    statistic.order.bestSellingProduct = yield order_model_1.default.aggregate([
        { $unwind: "$products" },
        {
            $group: {
                _id: "$products.product_id",
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
    ]);
    for (const product of statistic.order.bestSellingProduct) {
        const productInfo = yield product_model_1.default.findOne({ _id: product._id });
        product.title = productInfo.title;
    }
    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tổng quan",
        statistic: statistic,
    });
});
exports.dashboard = dashboard;
