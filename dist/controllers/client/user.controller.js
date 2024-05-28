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
exports.resetPasswordPost = exports.resetPassword = exports.otpPasswordPost = exports.otpPassword = exports.forgotPasswordPost = exports.forgotPassword = exports.info = exports.logout = exports.loginPost = exports.login = exports.registerPost = exports.register = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const md5_1 = __importDefault(require("md5"));
const cart_model_1 = __importDefault(require("../../models/cart.model"));
const forgot_password_model_1 = __importDefault(require("../../models/forgot-password.model"));
const sendEmail_1 = require("../../helpers/sendEmail");
const generate_1 = require("../../helpers/generate");
const register = (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản",
    });
};
exports.register = register;
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const existEmail = yield user_model_1.default.findOne({
        email: req.body.email,
        deleted: false,
    });
    if (existEmail) {
        req.flash("error", `${req.body.email} đã tồn tại!`);
        res.redirect("back");
        return;
    }
    req.body.password = (0, md5_1.default)(req.body.password);
    const user = new user_model_1.default(req.body);
    yield user.save();
    res.redirect("/user/login");
});
exports.registerPost = registerPost;
const login = (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập",
    });
};
exports.login = login;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAccount = yield user_model_1.default.findOne({
        email: req.body.email,
        deleted: false,
    });
    if (!userAccount) {
        req.flash("error", "Email không chính xác!");
        res.redirect("back");
        return;
    }
    if (userAccount.password !== (0, md5_1.default)(req.body.password)) {
        req.flash("error", "Mật khẩu không chính xác!");
        res.redirect("back");
        return;
    }
    if (userAccount.status === "inactive") {
        req.flash("error", "Tài khoản của bạn đang bị khóa!");
        res.redirect("back");
        return;
    }
    res.cookie("tokenUser", userAccount.tokenUser);
    yield cart_model_1.default.updateOne({
        _id: req.cookies.cartId,
    }, {
        user_id: userAccount.id,
    });
    res.redirect("/");
});
exports.loginPost = loginPost;
const logout = (req, res) => {
    res.clearCookie("tokenUser");
    res.clearCookie("cartId");
    res.redirect("/");
};
exports.logout = logout;
const info = (req, res) => {
    res.render("client/pages/user/infoUser", {
        pageTitle: "Thông tin tài khoản",
    });
};
exports.info = info;
const forgotPassword = (req, res) => {
    res.render("client/pages/user/forgotPassword", {
        pageTitle: "Quên mật khẩu",
    });
};
exports.forgotPassword = forgotPassword;
const forgotPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const user = yield user_model_1.default.findOne({ email, deleted: false });
        if (!user) {
            req.flash("error", "Email không tồn tại?");
            res.redirect("back");
            return;
        }
        const OTP = (0, generate_1.generateRandomNumber)(4);
        let objectForgotPassword = {
            email: email,
            OTP: OTP,
            expireAt: new Date(Date.now() + 10 * 60 * 1000),
        };
        const forgotPassword = new forgot_password_model_1.default(objectForgotPassword);
        yield forgotPassword.save();
        const subject = "Mã OTP xác nhận lấy lại mật khẩu";
        const html = `
      Mã OTP để xác minh lấy lại mật khẩu của bạn là <b>${OTP}</b>. Thời gian lấy lại mật khẩu là 10 phút.
      Lưu ý: Bạn không nên để lộ thông tin này với người khác!
    `;
        (0, sendEmail_1.sendMail)(email, subject, html);
        res.redirect(`/user/password/otp?email=${email}`);
    }
    catch (error) {
        req.flash("error", "Không thực hiện được");
        res.redirect("back");
    }
});
exports.forgotPasswordPost = forgotPasswordPost;
const otpPassword = (req, res) => {
    try {
        const email = req.query.email;
        res.render("client/pages/user/OTP", {
            pageTitle: "Nhập mã OTP",
            email: email,
        });
    }
    catch (error) {
        req.flash("error", "Không thực hiện được");
        res.redirect("back");
    }
};
exports.otpPassword = otpPassword;
const otpPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const OTP = req.body.OTP;
        const getForgotPassword = yield forgot_password_model_1.default.findOne({
            email: email,
            OTP: OTP,
        });
        if (!getForgotPassword) {
            req.flash("error", "Mã OTP không hợp lệ");
            res.redirect("back");
            return;
        }
        const userForgotPassword = yield user_model_1.default.findOne({ email });
        if (!userForgotPassword) {
            req.flash("error", "Không tìm thấy user này");
            res.redirect("back");
            return;
        }
        res.cookie("tokenUser", userForgotPassword.tokenUser);
        res.redirect("/user/password/reset");
    }
    catch (error) {
        req.flash("error", "Không thực hiện được");
        res.redirect("back");
    }
});
exports.otpPasswordPost = otpPasswordPost;
const resetPassword = (req, res) => {
    res.render("client/pages/user/resetPassword", {
        pageTitle: "Thay đổi mật khẩu",
    });
};
exports.resetPassword = resetPassword;
const resetPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPassword = req.body.password;
        const tokenUser = req.cookies.tokenUser;
        yield user_model_1.default.updateOne({
            tokenUser: tokenUser,
        }, {
            password: (0, md5_1.default)(newPassword),
        });
        res.redirect("/");
    }
    catch (error) {
        req.flash("error", "Không thực hiện được");
        res.redirect("back");
    }
});
exports.resetPasswordPost = resetPasswordPost;
