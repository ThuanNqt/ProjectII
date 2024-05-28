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
exports.editPatch = exports.edit = exports.detail = exports.changeStatus = exports.deleteAccount = exports.createPost = exports.create = exports.index = void 0;
const account_model_1 = __importDefault(require("../../models/account.model"));
const role_model_1 = __importDefault(require("../../models/role.model"));
const md5_1 = __importDefault(require("md5"));
const filterStatus_1 = __importDefault(require("../../helpers/filterStatus"));
const search_1 = __importDefault(require("../../helpers/search"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false,
    };
    const filterStatus = (0, filterStatus_1.default)(req.query);
    if (req.query.status) {
        find.status = req.query.status.toString();
    }
    const objSearch = (0, search_1.default)(req.query);
    if (req.query.keyword) {
        find.fullName = objSearch.regex;
    }
    const records = yield account_model_1.default.find(find).select("-password -token");
    for (let record of records) {
        let role = yield role_model_1.default.findOne({
            _id: record.role_id,
            deleted: false,
        });
        record.role = role;
    }
    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records,
        filterStatus: filterStatus,
        keyword: objSearch.keyword,
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let find = {
            deleted: false,
        };
        const roles = yield role_model_1.default.find(find);
        res.render("admin/pages/accounts/create", {
            pageTitle: "Tạo tài khoản",
            roles: roles,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailExist = yield account_model_1.default.findOne({
            email: req.body.email,
            deleted: false,
        });
        if (emailExist) {
            req.flash("error", `Email ${req.body.email} đã tồn tại`);
            res.redirect("back");
            return;
        }
        else {
            req.body.password = (0, md5_1.default)(req.body.password);
            const record = new account_model_1.default(req.body);
            yield record.save();
            req.flash("success", "Tạo tài khoản thành công");
        }
    }
    catch (error) {
        req.flash("error", "Tạo tài khoản thất bại");
    }
    res.redirect(`/admin/accounts`);
});
exports.createPost = createPost;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield account_model_1.default.updateOne({ _id: id }, { deleted: true, deletedAt: Date.now() });
        req.flash("success", `Xóa tài khoản thành công!`);
    }
    catch (error) {
        req.flash("error", `Xóa tài khoản thất bại!`);
    }
    res.redirect("back");
});
exports.deleteAccount = deleteAccount;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = req.params.status;
        const id = req.params.id;
        yield account_model_1.default.updateOne({ _id: id }, { status: status });
        req.flash("success", "Cập nhật trạng thái tài khoản thành công!");
    }
    catch (error) {
        req.flash("error", "Cập nhật trạng thái tài khoản thất bại!");
    }
    res.redirect("back");
});
exports.changeStatus = changeStatus;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };
        const record = yield account_model_1.default.findOne(find).select("-password -token");
        let role = yield role_model_1.default.findOne({
            _id: record.role_id,
            deleted: false,
        });
        record.role = role;
        res.render(`admin/pages/accounts/detail`, {
            pageTitle: record.fullName,
            record: record,
        });
    }
    catch (error) {
        res.redirect(`/admin/accounts`);
    }
});
exports.detail = detail;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };
        const account = yield account_model_1.default.findOne(find);
        const roles = yield role_model_1.default.find({ deleted: false });
        res.render(`admin/pages/accounts/edit`, {
            pageTitle: "Chỉnh sửa tài khoản",
            account: account,
            roles: roles,
        });
    }
    catch (error) {
        res.redirect(`/admin/accounts`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailExist = yield account_model_1.default.findOne({
            email: req.body.email,
            deleted: false,
            _id: { $ne: req.params.id },
        });
        if (emailExist) {
            req.flash("error", `Email ${req.body.email} đã tồn tại`);
            res.redirect("back");
            return;
        }
        else {
            if (req.body.password) {
                req.body.password = (0, md5_1.default)(req.body.password);
            }
            yield account_model_1.default.updateOne({ _id: req.params.id }, req.body);
            req.flash("success", "Cập nhật tài khoản thành công!");
        }
    }
    catch (error) {
        req.flash("error", "Cập nhật tài khoản thất bại!");
        res.redirect(`/admin/accounts`);
    }
    res.redirect("back");
});
exports.editPatch = editPatch;
