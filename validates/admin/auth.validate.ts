import { Request, Response, NextFunction } from "express";

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
