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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordPost = exports.forgotPasswordPost = exports.loginPost = exports.registerPost = void 0;
const checkValidateRegex_1 = require("../../helpers/checkValidateRegex");
const registerPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.fullName) {
        req.flash("error", "Tên không được để trống");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Email không được để trống");
        res.redirect("back");
        return;
    }
    else {
        if (!(0, checkValidateRegex_1.regexEmail)(req.body.email)) {
            req.flash("error", "Email không đúng định dạng");
            res.redirect("back");
            return;
        }
    }
    if (!req.body.password) {
        req.flash("error", "Mật khẩu không được để trống");
        res.redirect("back");
        return;
    }
    if (req.body.password < 5) {
        req.flash("error", "Mật khẩu ít nhất 5 ký tự");
        res.redirect("back");
        return;
    }
    if (req.body.phone && !(0, checkValidateRegex_1.regexPhoneNumber)(req.body.phone)) {
        req.flash("error", "Số điện thoại không hợp lệ");
        res.redirect("back");
        return;
    }
    next();
});
exports.registerPost = registerPost;
const loginPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email) {
        req.flash("error", "Email không được để trống");
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Mật khẩu không được để trống");
        res.redirect("back");
        return;
    }
    next();
});
exports.loginPost = loginPost;
const forgotPasswordPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Email không được để trống");
        res.redirect("back");
        return;
    }
    next();
};
exports.forgotPasswordPost = forgotPasswordPost;
const resetPasswordPost = (req, res, next) => {
    if (!req.body.password) {
        req.flash("error", "Mật khẩu không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.confirmPassword) {
        req.flash("error", "Vui lòng xác nhận lại mật khẩu!");
        res.redirect("back");
        return;
    }
    if (req.body.password !== req.body.confirmPassword) {
        req.flash("error", "Mật khẩu xác nhận không trùng khớp!");
        res.redirect("back");
        return;
    }
    next();
};
exports.resetPasswordPost = resetPasswordPost;
