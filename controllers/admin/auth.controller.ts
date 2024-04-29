import Account from "../../models/account.model";
import md5 from "md5";
import { Request, Response } from "express";

interface IAccount {
  fullName: String;
  password: String;
  email: String;
  token: string;
  phone: String;
  avatar: String;
  role_id: String;
  status: String;
  deleted: boolean;
  deletedAt: Date;
}

//[GET] /admin/auth/login
export const login = (req: Request, res: Response) => {
  res.render("admin/pages/auth/login", {
    pageTitle: "Đăng nhập",
  });
};

//[POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user: IAccount = await Account.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  if (user.password !== md5(password)) {
    req.flash("error", "Mật khẩu không đúng!");
    res.redirect("back");
    return;
  }

  if (user.status === "inactive") {
    req.flash("error", "Tài khoản của bạn đã bị khóa!");
    res.redirect("back");
    return;
  }

  // Lưu luôn token của user vào trong cookie thay cho FE
  res.cookie("token", user.token);

  req.flash("success", "Đăng nhập thành công!");
  res.redirect(`/admin/dashboard`);
};
