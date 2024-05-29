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
exports.createPost = void 0;
const checkValidateRegex_1 = require("../../helpers/checkValidateRegex");
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.fullName) {
        req.flash("error", "Vui lòng nhập tên tài khoản");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập email");
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
        req.flash("error", "Vui lòng nhập mật khẩu");
        res.redirect("back");
        return;
    }
    if (req.body.password < 5) {
        req.flash("error", "Mật khẩu phải lớn hơn 5 ký tự");
        res.redirect("back");
        return;
    }
    next();
});
exports.createPost = createPost;
