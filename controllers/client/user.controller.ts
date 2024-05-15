import User from "../../models/user.model";
import md5 from "md5";
import { Request, Response } from "express";
import Cart from "../../models/cart.model";

//[GET] /user/register
export const register = (req: Request, res: Response) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

//[POST] /user/register
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
  res.redirect("/user/login");
};

//[GET] /user/login
export const login = (req: Request, res: Response) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập",
  });
};

//[POST] /user/login
export const loginPost = async (req: Request, res: Response) => {
  const userAccount = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (!userAccount) {
    req.flash("error", "Email không chính xác!");
    res.redirect("back");
    return;
  }

  if (userAccount.password !== md5(req.body.password)) {
    req.flash("error", "Mật khẩu không chính xác!");
    res.redirect("back");
    return;
  }

  if (userAccount.status === "inactive") {
    req.flash("error", "Tài khoản của bạn đang bị khóa!");
    res.redirect("back");
    return;
  }

  res.cookie("tokenUser", userAccount.tokenUser);

  //Lưu user_id vào collection carts
  await Cart.updateOne(
    {
      _id: req.cookies.cartId,
    },
    {
      user_id: userAccount.id,
    }
  );

  res.redirect("/");
};

//[GET] /user/logout
export const logout = (req: Request, res: Response) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};

// [GET] /user/info
export const info = (req:Request, res:Response) => {
  res.render("client/pages/user/infoUser", {
    pageTitle: "Thông tin tài khoản",
  });
};