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
exports.detail = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.deleteProduct = exports.changeStatus = exports.index = void 0;
const product_model_1 = __importDefault(require("../../models/product.model"));
const account_model_1 = __importDefault(require("../../models/account.model"));
const product_category_model_1 = __importDefault(require("../../models/product-category.model"));
const filterStatus_1 = __importDefault(require("../../helpers/filterStatus"));
const search_1 = __importDefault(require("../../helpers/search"));
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const createTree_1 = __importDefault(require("../../helpers/createTree"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false,
    };
    const filterStatus = (0, filterStatus_1.default)(req.query);
    if (req.query.status) {
        find.status = req.query.status.toString();
    }
    const objSearch = (0, search_1.default)(req.query);
    if (req.query.keyword) {
        find.title = objSearch.regex;
    }
    const sort = {};
    if (typeof req.query.sortKey === "string" &&
        typeof req.query.sortValue === "string") {
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        sort[sortKey] = sortValue;
    }
    else {
        sort.position = "desc";
    }
    const countProduct = yield product_model_1.default.countDocuments(find);
    const objPagination = (0, pagination_1.default)(req.query, countProduct);
    const products = yield product_model_1.default.find(find)
        .sort(sort)
        .limit(objPagination.limitItems)
        .skip(objPagination.skip);
    for (const product of products) {
        const createdByAccount = yield account_model_1.default.findOne({
            _id: product.createdBy.account_id
        });
        if (createdByAccount) {
            product.accountFullName = createdByAccount.fullName;
        }
        const lastUpdatedByAccount = product.updatedBy.slice(-1)[0];
        if (lastUpdatedByAccount) {
            const userUpdated = yield account_model_1.default.findOne({
                _id: lastUpdatedByAccount.account_id,
            });
            lastUpdatedByAccount.accountEditFullName = userUpdated.fullName;
        }
    }
    res.render("admin/pages/products/index.pug", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objSearch.keyword,
        pagination: objPagination,
    });
});
exports.index = index;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = req.params.status;
        const id = req.params.id;
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: Date.now(),
        };
        yield product_model_1.default.updateOne({ _id: id }, {
            status: status,
            $push: {
                updatedBy: updatedBy
            }
        });
        req.flash("success", "Cập nhật trạng thái thành công!");
    }
    catch (error) {
        req.flash("error", "Cập nhật trạng thái thất bại!");
    }
    res.redirect("back");
});
exports.changeStatus = changeStatus;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield product_model_1.default.updateOne({ _id: id }, { deleted: true, deletedBy: {
                account_id: res.locals.user.id,
                deletedAt: Date.now()
            } });
        req.flash("success", "Xóa sản phẩm thành công!");
    }
    catch (error) {
        req.flash("success", "Xóa sản phẩm thất bại!");
    }
    res.redirect("back");
});
exports.deleteProduct = deleteProduct;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false,
    };
    const category = yield product_category_model_1.default.find(find);
    const newCategory = (0, createTree_1.default)(category);
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm sản phẩm",
        category: newCategory,
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        if (req.body.position === "") {
            const countProduct = yield product_model_1.default.countDocuments();
            req.body.position = countProduct + 1;
        }
        else {
            req.body.position = parseInt(req.body.position);
        }
        req.body.createdBy = {
            account_id: res.locals.user.id
        };
        const product = new product_model_1.default(req.body);
        yield product.save();
        req.flash("success", `Tạo sản phẩm thành công!`);
    }
    catch (error) {
        req.flash("success", `Tạo sản phẩm thất bại!`);
    }
    res.redirect("/admin/products");
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const find = {
            deleted: false,
            _id: id,
        };
        const product = yield product_model_1.default.findOne(find);
        const category = yield product_category_model_1.default.find({ deleted: false });
        const newCategory = (0, createTree_1.default)(category);
        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            category: newCategory,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.price = parseInt(req.body.price);
        req.body.stock = parseInt(req.body.stock);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.position = parseInt(req.body.position);
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: Date.now(),
        };
        yield product_model_1.default.updateOne({ _id: req.params.id }, Object.assign(Object.assign({}, req.body), { $push: {
                updatedBy: updatedBy
            } }));
        req.flash("success", `Cập nhật sản phẩm thành công!`);
    }
    catch (error) {
        req.flash("success", `Cập nhật sản phẩm thất bại!`);
    }
    res.redirect("/admin/products");
});
exports.editPatch = editPatch;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const find = {
            deleted: false,
            _id: id,
        };
        const product = yield product_model_1.default.findOne(find);
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product,
        });
    }
    catch (error) {
        res.redirect("/admin/products");
    }
});
exports.detail = detail;
