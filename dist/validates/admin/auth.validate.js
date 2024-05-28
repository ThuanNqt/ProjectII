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
exports.loginPost = void 0;
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
