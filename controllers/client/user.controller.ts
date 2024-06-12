import { cartId } from "./../../middlewares/client/cart.middleware";
import User from "../../models/user.model";
import md5 from "md5";
import { Request, Response } from "express";
import Cart from "../../models/cart.model";
import ForgotPassword from "../../models/forgot-password.model";
import { sendMail } from "../../helpers/sendEmail";
import { generateRandomNumber } from "../../helpers/generate";
import Order from "../../models/order.model";
import Product from "../../models/product.model";
import OrderRating from "../../models/order-rating.model";
import OrderShipping from "../../models/order-shipping.model";

interface IForgotPassword {
  email: string;
  OTP: string;
  expireAt: Date;
}

interface ICart {
  user_id?: string;
  products: IProductCart[];
  totalPrice?: number;
}

interface IProductCart {
  product_id: string;
  quantity: number;
  totalPrice?: number;
  productInfo?: IProduct;
}

interface IProduct {
  title: string;
  product_category_id: string;
  description: string;
  price: number;
  newPrice?: number;
  discountPercentage: number;
  stock: number;
  thumbnail: string;
  status: string;
  featured: string;
  position: number;
  deleted: boolean;
  deletedAt: Date;
  slug: string;
}

interface IOrder {
  totalPriceCart?: number;
  save?(): Promise<IOrder>;
  id: string;
  cart_id: string;
  userInfo: {
    fullName: string;
    phone: string;
    address: string;
  };
  products: {
    totalPriceProduct?: number;
    newPrice?: number;
    productInfo?: IProduct;
    product_id: string;
    quantity: number;
    price: number;
    discountPercentage: number;
  }[];
  totalQuantityOfOrder?: number;
  totalPriceOrder?: number;
  paymentType?: string;
  payment?: boolean;
  status?: string;
  infoShipper?: {
    shipName?: string;
    shipPhone?: string;
  };
}

interface IOrderRating {
  user_id: string;
  order_id: string;
  products: {
    product_id: string;
    rating: number;
    comment: string;
  };
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
export const info = async (req: Request, res: Response) => {
  const cartId = req.cookies.cartId;

  const orders: IOrder[] = await Order.find({
    cart_id: cartId,
  });

  for (const order of orders) {
    let totalPriceOrder = 0,
      totalQuantityOfOrder = 0;
    for (const product of order.products) {
      product.productInfo = await Product.findOne({
        _id: product.product_id,
      });
      product.newPrice = Math.floor(
        product.price * (1 - product.discountPercentage / 100)
      );
      product.totalPriceProduct = product.newPrice * product.quantity;

      totalPriceOrder += product.totalPriceProduct;
      totalQuantityOfOrder += product.quantity;
    }
    order.totalPriceOrder = totalPriceOrder;
    order.totalQuantityOfOrder = totalQuantityOfOrder;

    order.infoShipper = await OrderShipping.findOne({
      order_id: order.id,
    })
      .select("shipName shipPhone")
      .sort({ createdAt: -1 })
      .limit(1);
  }
  res.render("client/pages/user/infoUser", {
    pageTitle: "Thông tin tài khoản",
    orders: orders.reverse(),
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

// [GET] /user/editInfo
export const editInfo = async (req: Request, res: Response) => {
  const user = await User.findOne({ tokenUser: req.cookies.tokenUser });
  res.render("client/pages/user/editInfo", {
    pageTitle: "Chỉnh sửa thông tin",
    user: user,
  });
};

// [PATCH] /user/editInfo
export const editInfoPatch = async (req: Request, res: Response) => {
  try {
    const existEmail = await User.findOne({
      email: req.body.email,
      deleted: false,
      tokenUser: { $ne: req.cookies.tokenUser }, // Không kiểm tra email của chính record đang sửa
    });
    const phoneExist = await User.findOne({
      phone: req.body.phone,
      deleted: false,
      tokenUser: { $ne: req.cookies.tokenUser }, // Không kiểm tra email của chính record đang sửa
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

    await User.updateOne(
      {
        tokenUser: req.cookies.tokenUser,
      },
      req.body
    );

    req.flash("success", "Cập nhật thông tin thành công");
    res.redirect("/user/info");
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật thông tin thất bại");
    res.redirect("back");
  }
};

// [GET] /user/order-rating/:order_id
export const orderRating = async (req: Request, res: Response) => {
  const user = await User.findOne({ tokenUser: req.cookies.tokenUser });
  const order: IOrder = await Order.findOne({
    _id: req.params.order_id,
  });

  if (order) {
    for (const product of order.products) {
      product.productInfo = await Product.findOne({
        _id: product.product_id,
      });
      product.newPrice = Math.floor(
        product.price * (1 - product.discountPercentage / 100)
      );
      product.totalPriceProduct = product.newPrice * product.quantity;
    }
  }

  res.render("client/pages/user/orderRating", {
    pageTitle: "Đánh giá đơn hàng",
    user: user,
    order: order,
  });
};

// [POST] /user/order-rating
export const orderRatingPost = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ tokenUser: req.cookies.tokenUser });

    // Kiểm tra sản phẩm này trong đơn hàng đã được đánh giá chưa, mỗi sản phẩm chỉ được đánh giá một lần
    const existingRating = await OrderRating.findOne({
      user_id: user.id,
      order_id: req.body.order_id,
      "products.product_id": req.body.product_id,
    });

    if (existingRating) {
      req.flash("error", "Sản phẩm này đã được đánh giá");
      res.redirect("back");
      return;
    }

    const orderRating = new OrderRating({
      user_id: user._id,
      order_id: req.body.order_id,
      products: {
        product_id: req.body.product_id,
        rating: req.body.rating,
        comment: req.body.comment,
      },
    });
    await orderRating.save();

    req.flash("success", "Đánh giá thành công");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Đánh giá thất bại");
    res.redirect("back");
  }
};

// [DELETE] /user/order-cancel/:order_id
export const orderCancelDelete = async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.order_id });
    if (!order) {
      req.flash("error", "Đơn hàng không tồn tại");
      res.redirect("back");
      return;
    }

    if (order.payment) {
      req.flash("error", "Đơn hàng đã thanh toán không thể hủy đơn");
      res.redirect("back");
      return;
    }

    await Order.updateOne(
      { _id: req.params.order_id },
      { deleted: true, status: "cancel" }
    );

    // Tăng lại số lượng products đã thay đổi
    for (const product of order.products) {
      const productInfo: IProduct = await Product.findOne({
        _id: product.product_id,
      });
      const newStock = productInfo.stock + product.quantity;
      await Product.updateOne(
        {
          _id: product.product_id,
        },
        {
          stock: newStock,
        }
      );
    }

    req.flash("success", "Đơn hàng đã bị huỷ");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Hủy đơn thất bại");
    res.redirect("back");
  }
};
