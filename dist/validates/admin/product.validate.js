"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = void 0;
const createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", "Vui lòng nhập tiêu đề sản phẩm!");
        res.redirect("back");
        return;
    }
    if (req.body.price === "0") {
        req.flash("error", "Vui lòng nhập giá của sản phẩm!");
        res.redirect("back");
        return;
    }
    if (req.body.price < 1000) {
        req.flash("error", "Giá của sản phẩm phải lớn hơn 1000đ");
        res.redirect("back");
        return;
    }
    if (req.body.stock === 0) {
        req.flash("error", "Vui lòng nhập số lượng sản phẩm!");
        res.redirect("back");
        return;
    }
    if (req.body.stock <= 0) {
        req.flash("error", "Số lượng sản phẩm phải lớn hơn 1");
        res.redirect("back");
        return;
    }
    next();
};
exports.createPost = createPost;
