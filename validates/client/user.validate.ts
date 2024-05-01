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
