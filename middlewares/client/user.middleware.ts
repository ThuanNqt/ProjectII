import { Request, Response, NextFunction } from "express";
import User from "../../models/user.model";

// If you have a more specific type for your user object, use that instead of any
interface MyLocals {
  user?: any;
}

export const infoUser = async (
  req: Request,
  res: Response<MyLocals>,
  next: NextFunction
) => {
  if (req.cookies.tokenUser) {
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
    }).select("-password");

    if (user) {
      res.locals.user = user;
    }
  }
  next();
};
