import { NextFunction, Request, Response } from "express";

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
  }

  if (!req.body.password) {
    req.flash("error", "Mật khẩu không được để trống");
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
