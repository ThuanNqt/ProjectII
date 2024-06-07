import { NextFunction, Request, Response } from "express";
import { regexEmail, regexPhoneNumber } from "../../helpers/checkValidateRegex";

export const registerPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.fullName) {
    req.flash("error", "Tên không được để trống");
    res.redirect("back");
    return;
  }

  if (!req.body.email) {
    req.flash("error", "Email không được để trống");
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
    req.flash("error", "Mật khẩu không được để trống");
    res.redirect("back");
    return;
  }

  if (req.body.password < 5) {
    req.flash("error", "Mật khẩu ít nhất 5 ký tự");
    res.redirect("back");
    return;
  }

  if (req.body.phone && !regexPhoneNumber(req.body.phone)) {
    req.flash("error", "Số điện thoại không hợp lệ");
    res.redirect("back");
    return;
  }

  next();
};

export const loginPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};

export const forgotPasswordPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.email) {
    req.flash("error", "Email không được để trống");
    res.redirect("back");
    return;
  }
  next();
};

export const resetPasswordPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
