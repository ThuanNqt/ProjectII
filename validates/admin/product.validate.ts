import { NextFunction, Request, Response } from "express";

export const createPost = (req: Request, res: Response, next: NextFunction) => {
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
