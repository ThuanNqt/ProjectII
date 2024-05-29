import { NextFunction, Request, Response } from "express";

export const createRole = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.title) {
    req.flash("error", "Vui lòng nhập tên quyền");
    res.redirect("back");
    return;
  }
  next();
};
