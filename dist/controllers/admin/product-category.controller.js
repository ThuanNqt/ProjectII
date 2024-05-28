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
exports.detail = exports.editPatch = exports.edit = exports.deleteItem = exports.changeStatus = exports.createPost = exports.create = exports.index = void 0;
const product_category_model_1 = __importDefault(require("../../models/product-category.model"));
const filterStatus_1 = __importDefault(require("../../helpers/filterStatus"));
const search_1 = __importDefault(require("../../helpers/search"));
const createTree_1 = __importDefault(require("../../helpers/createTree"));
const product_model_1 = __importDefault(require("../../models/product.model"));
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
    const countProduct = yield product_category_model_1.default.countDocuments(find);
    const productCategories = (yield product_category_model_1.default.find(find).sort({
        position: "desc",
    }));
    const newRecords = (0, createTree_1.default)(productCategories);
    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
        filterStatus: filterStatus,
        keyword: objSearch.keyword,
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false,
    };
    const records = yield product_category_model_1.default.find(find);
    const newRecords = (0, createTree_1.default)(records);
    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords,
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);
        if (req.body.position === "") {
            const countProduct = yield product_category_model_1.default.countDocuments();
            req.body.position = countProduct + 1;
        }
        else {
            req.body.position = parseInt(req.body.position);
        }
        const productCategory = new product_category_model_1.default(req.body);
        yield productCategory.save();
        req.flash("success", `Tạo danh mục thành công!`);
    }
    catch (error) {
        req.flash("error", `Tạo danh mục thất bại!`);
    }
    res.redirect("/admin/products-category");
});
exports.createPost = createPost;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = req.params.status;
        const id = req.params.id;
        yield product_category_model_1.default.updateOne({ _id: id }, { status: status });
        req.flash("success", `Thay đổi trạng thái thành công!`);
    }
    catch (error) {
        req.flash("error", `Thay đổi trạng thái thất bại!`);
    }
    res.redirect("back");
});
exports.changeStatus = changeStatus;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const categoryChild = yield product_category_model_1.default.findOne({
            parent_id: id,
            deleted: false,
        });
        const product = yield product_model_1.default.findOne({
            product_category_id: id,
            deleted: false,
        });
        if (categoryChild) {
            req.flash("error", `Danh mục này đang chứa một số danh mục con!`);
            return res.redirect("back");
        }
        if (product) {
            req.flash("error", `Danh mục này đang chứa một số sản phẩm!`);
            return res.redirect("back");
        }
        yield product_category_model_1.default.updateOne({ _id: id }, { deleted: true, deletedAt: Date.now() });
        req.flash("success", `Xóa danh mục thành công!`);
    }
    catch (error) {
        req.flash("error", `Xóa danh mục thất bại!`);
    }
    res.redirect("back");
});
exports.deleteItem = deleteItem;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const find = {
            deleted: false,
            _id: id,
        };
        const productCategory = yield product_category_model_1.default.findOne(find);
        const records = yield product_category_model_1.default.find({ deleted: false });
        const newRecords = (0, createTree_1.default)(records);
        res.render(`admin/pages/products-category/edit`, {
            pageTitle: "Chỉnh sửa sản phẩm",
            data: productCategory,
            records: newRecords,
        });
    }
    catch (error) {
        res.redirect(`/admin/products-category`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.position = parseInt(req.body.position);
        yield product_category_model_1.default.updateOne({ _id: req.params.id }, req.body);
        req.flash("success", `Cập nhật danh mục thành công!`);
    }
    catch (error) {
        req.flash("success", `Cập nhật danh mục thất bại!`);
    }
    res.redirect("/admin/products-category");
});
exports.editPatch = editPatch;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const find = {
            deleted: false,
            _id: id,
        };
        const productCategory = yield product_category_model_1.default.findOne(find);
        const titleProductCategory = yield product_category_model_1.default.findOne({
            deleted: false,
            _id: productCategory.parent_id,
        });
        res.render(`admin/pages/products-category/detail`, {
            pageTitle: productCategory.title,
            productCategory: productCategory,
            titleProductCategory: titleProductCategory,
        });
    }
    catch (error) {
        res.redirect(`/admin/products-category`);
    }
});
exports.detail = detail;
