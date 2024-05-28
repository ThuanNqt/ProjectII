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
exports.permissionsPatch = exports.permissions = exports.editPatch = exports.edit = exports.detail = exports.deleteRole = exports.createPost = exports.create = exports.index = void 0;
const search_1 = __importDefault(require("../../helpers/search"));
const account_model_1 = __importDefault(require("../../models/account.model"));
const role_model_1 = __importDefault(require("../../models/role.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false,
    };
    const objSearch = (0, search_1.default)(req.query);
    if (req.query.keyword) {
        find.title = objSearch.regex;
    }
    const records = yield role_model_1.default.find(find);
    res.render("admin/pages/roles/index", {
        pageTitle: "Trang nhóm quyền",
        records: records,
    });
});
exports.index = index;
const create = (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Trang tạo nhóm quyền",
    });
};
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = new role_model_1.default(req.body);
        yield record.save();
        req.flash("success", `Tạo quyền thành công!`);
    }
    catch (error) {
        req.flash("error", `Tạo quyền thất bại!`);
    }
    res.redirect(`/admin/roles`);
});
exports.createPost = createPost;
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const account = yield account_model_1.default.findOne({ role_id: id });
        if (account) {
            req.flash("error", `Một số tài khoản đang có quyền này!`);
            return res.redirect(`back`);
        }
        yield role_model_1.default.updateOne({ _id: id }, { deleted: true });
        req.flash("success", `Xóa nhóm quyền thành công!`);
    }
    catch (error) {
        req.flash("error", `Xóa nhóm quyền thất bại!`);
    }
    res.redirect(`/admin/roles`);
});
exports.deleteRole = deleteRole;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };
        const role = yield role_model_1.default.findOne(find);
        res.render(`admin/pages/roles/detail`, {
            pageTitle: role.title,
            role: role,
        });
    }
    catch (error) {
        res.redirect(`/admin/roles`);
    }
});
exports.detail = detail;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        };
        const role = yield role_model_1.default.findOne(find);
        res.render(`admin/pages/roles/edit`, {
            pageTitle: role.title,
            role: role,
        });
    }
    catch (error) {
        res.redirect(`/admin/roles`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield role_model_1.default.updateOne({ _id: req.params.id }, req.body);
        res.redirect("/admin/roles");
        req.flash("success", `Cập nhật quyền thành công!`);
    }
    catch (error) {
        req.flash("error", `Cập nhật quyền thất bại!`);
    }
});
exports.editPatch = editPatch;
const permissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = {
            deleted: false,
        };
        const records = yield role_model_1.default.find(find);
        res.render("admin/pages/roles/permissions", {
            pageTitle: "Trang phân quyền",
            records: records,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.permissions = permissions;
const permissionsPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissions = JSON.parse(req.body.permissions);
        for (const item of permissions) {
            yield role_model_1.default.updateOne({ _id: item.id }, { permissions: item.permissions });
        }
        req.flash("success", "Phân quyền thành công!");
    }
    catch (error) {
        req.flash("error", "Phân quyền thất bại!");
    }
    res.redirect("back");
});
exports.permissionsPatch = permissionsPatch;
