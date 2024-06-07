import User from "../../models/user.model";
import md5 from "md5";
import { Request, Response } from "express";
import Cart from "../../models/cart.model";
import ForgotPassword from "../../models/forgot-password.model";
import { sendMail } from "../../helpers/sendEmail";
import { generateRandomNumber } from "../../helpers/generate";

interface IForgotPassword {
  email: string;
  OTP: string;
  expireAt: Date;
}

//[GET] /user/register
export const register = (req: Request, res: Response) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

//[POST] /user/register
export const registerPost = async (req: Request, res: Response) => {
  try {
    const existEmail = await User.findOne({
      email: req.body.email,
      deleted: false,
    });
    const phoneExist = await User.findOne({
      phone: req.body.phone,
      deleted: false,
    });
    if (existEmail) {
      req.flash("error", `${req.body.email} đã tồn tại!`);
      res.redirect("back");
      return;
    }

    if (phoneExist) {
      req.flash("error", `${req.body.phone} đã tồn tại!`);
      res.redirect("back");
      return;
    }

    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();

    req.flash("success", "Đăng ký thành công");
    res.redirect("/user/login");
  } catch (error) {
    req.flash("error", "Đăng ký thất bại");
    console.log(error);
  }
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

  const cartExist = await Cart.findOne({ user_id: userAccount.id });
  if (cartExist) {
    res.cookie("cartId", cartExist._id);
  } else {
    const cart = new Cart({ user_id: userAccount.id });
    await cart.save();
    res.cookie("cartId", cart._id);
  }

  res.redirect("/");
};

//[GET] /user/logout
export const logout = (req: Request, res: Response) => {
  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
  res.redirect("/");
};

// [GET] /user/info
export const info = (req: Request, res: Response) => {
  res.render("client/pages/user/infoUser", {
    pageTitle: "Thông tin tài khoản",
  });
};

// [GET] /user/password/forgot
export const forgotPassword = (req: Request, res: Response) => {
  res.render("client/pages/user/forgotPassword", {
    pageTitle: "Quên mật khẩu",
  });
};

// [POST] /user/password/forgot
export const forgotPasswordPost = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email, deleted: false });
    if (!user) {
      req.flash("error", "Email không tồn tại?");
      res.redirect("back");
      return;
    }

    // 1. Tạo mã OTP và lưu vào database forgot-password
    const OTP = generateRandomNumber(4);
    let objectForgotPassword: IForgotPassword = {
      email: email,
      OTP: OTP,
      expireAt: new Date(Date.now() + 10 * 60 * 1000),
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    // 2. Gửi mã OTP qua email
    const subject = "Mã OTP xác nhận lấy lại mật khẩu";
    const html = `
      Mã OTP để xác minh lấy lại mật khẩu của bạn là <b>${OTP}</b>. Thời gian lấy lại mật khẩu là 10 phút.
      Lưu ý: Bạn không nên để lộ thông tin này với người khác!
    `;
    sendMail(email, subject, html);
    res.redirect(`/user/password/otp?email=${email}`);
  } catch (error) {
    req.flash("error", "Không thực hiện được");
    res.redirect("back");
  }
};

// [GET] /user/password/otp
export const otpPassword = (req: Request, res: Response) => {
  try {
    const email = req.query.email;
    res.render("client/pages/user/OTP", {
      pageTitle: "Nhập mã OTP",
      email: email,
    });
  } catch (error) {
    req.flash("error", "Không thực hiện được");
    res.redirect("back");
  }
};

// [POST] /user/password/otp
export const otpPasswordPost = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const OTP = req.body.OTP;

    const getForgotPassword = await ForgotPassword.findOne({
      email: email,
      OTP: OTP,
    });

    if (!getForgotPassword) {
      req.flash("error", "Mã OTP không hợp lệ");
      res.redirect("back");
      return;
    }

    // get user
    const userForgotPassword = await User.findOne({ email });

    if (!userForgotPassword) {
      req.flash("error", "Không tìm thấy user này");
      res.redirect("back");
      return;
    }

    // save cookie tokenUser
    res.cookie("tokenUser", userForgotPassword.tokenUser);
    res.redirect("/user/password/reset");
  } catch (error) {
    req.flash("error", "Không thực hiện được");
    res.redirect("back");
  }
};

// [GET] /user/password/reset
export const resetPassword = (req: Request, res: Response) => {
  res.render("client/pages/user/resetPassword", {
    pageTitle: "Thay đổi mật khẩu",
  });
};

// [POST] /user/password/reset
export const resetPasswordPost = async (req: Request, res: Response) => {
  try {
    const newPassword = req.body.password;

    const tokenUser = req.cookies.tokenUser;

    await User.updateOne(
      {
        tokenUser: tokenUser,
      },
      {
        password: md5(newPassword),
      }
    );
    res.redirect("/");
  } catch (error) {
    req.flash("error", "Không thực hiện được");
    res.redirect("back");
  }
};
