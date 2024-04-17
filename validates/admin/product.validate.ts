import { NextFunction, Request, Response } from "express";

export const createPost = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.title) {
    //req.flash("error", "Vui lòng nhập tiêu đề sản phẩm!");
    res.redirect("back");
    return;
  }
  next();
};
