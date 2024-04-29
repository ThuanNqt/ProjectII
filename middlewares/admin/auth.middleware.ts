import Account from "../../models/account.model";
import { Request, Response, NextFunction } from "express";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.token) {
    res.redirect(`/admin/auth/login`);
    return;
  } else {
    const user = await Account.findOne({
      token: req.cookies.token,
      deleted: false,
    });
    if (!user) {
      res.redirect(`/admin/auth/login`);
      return;
    } else {
      next();
    }
  }
};
