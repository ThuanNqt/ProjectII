import User from "../../models/user.model";
import { Request, Response, NextFunction } from "express";

interface IUser {
  fullName: string,
    password: string,
    email: string,
    tokenUser: string,
    phone: string,
    avatar: string,
    status: string,
    deleted: boolean,
    deletedAt: Date,
}

export const requireAuth = async (req:Request, res:Response, next:NextFunction) => {
  if (!req.cookies.tokenUser) {
    res.redirect(`/user/login`);
    return;
  }
  const user:IUser = await User.findOne({
    tokenUser: req.cookies.tokenUser,
    deleted: false,
  }).select("-password");
  if (!user) {
    res.redirect(`/user/login`);
    return;
  }
  next();
};
