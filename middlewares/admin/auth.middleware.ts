import Account from "../../models/account.model";
import Role from "../../models/role.model";
import { Request, Response, NextFunction } from "express";

interface IAccount {
  fullName: string,
    password: string,
    email: string,
    token: string,
    phone: string,
    avatar: string,
    role_id: string,
    status: string,
    deleted: boolean,
    deletedAt: Date,
}

interface IRole{
  title: string,
    description: string,
    permissions: string[],
    deleted: boolean,
    deletedAt: Date,
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.token) {
    res.redirect(`/admin/auth/login`);
    return;
  } else {
    const user:IAccount = await Account.findOne({
      token: req.cookies.token,
      deleted: false,
    }).select("-password");
    if (!user) {
      res.redirect(`/admin/auth/login`);
      return;
    } else {
      const role:IRole = await Role.findOne({ _id: user.role_id }).select(
        "title permissions"
      );
      // Khai báo app locals để tất cả file pug đều có thể sử dụng được như biến prefixAdmin
      res.locals.user = user;
      res.locals.role = role;
      next();
    }
  }
};
