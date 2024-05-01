import User from "../../models/user.model";
import md5 from "md5";
import { Request, Response } from "express";

//[GET] /user/controller
export const register = (req: Request, res: Response) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

//[POST] /user/controller
export const registerPost = async (req: Request, res: Response) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (existEmail) {
    req.flash("error", `${req.body.email} đã tồn tại!`);
    res.redirect("back");
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();
  //res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};
