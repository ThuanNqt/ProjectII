import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";

// If you have a more specific type for your user object, use that instead of any
interface IUser {
  fullName: string;
  password: string;
  email: string;
  tokenUser: string;
  phone: string;
  avatar: string;
  status: string;
  deleted: boolean;
  deletedAt: Date;
}

export const infoUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.cookies.tokenUser) {
    const user: IUser = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
    }).select("-password");

    if (user) {
      res.locals.user = user;
    }
  }
  next();
};
