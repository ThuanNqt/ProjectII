import { NextFunction, Request, Response } from "express";
import { regexEmail, regexPhoneNumber } from "../../helpers/checkValidateRegex";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.fullName) {
    req.flash("error", "Vui lòng nhập tên tài khoản");
    res.redirect("back");
    return;
  }

  if (!req.body.email) {
    req.flash("error", "Vui lòng nhập email");
    res.redirect("back");
    return;
  } else {
    if (!regexEmail(req.body.email)) {
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
};
