import Cart from "../../models/cart.model";
import Product from "../../models/product.model";
import { priceNewProduct } from "../../helpers/product";
import { Request, Response } from "express";
import Order from "../../models/order.model";
// payment with VNPay
import axios from "axios";
import qs from "qs";
import crypto from "crypto";
import moment from "moment";
import { sendMail } from "../../helpers/sendEmail";
import User from "../../models/user.model";

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
  paymentType?: string;
  payment?: boolean;
}

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

// [GET] /checkout
export const index = async (req: Request, res: Response) => {
  const cart: ICart = await Cart.findOne({
    _id: req.cookies.cartId,
  });

  //Get product
  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;

      const productInfo: IProduct = await Product.findOne({
        _id: productId,
      });

      // Add new price to productInfo
      const newPrice = parseInt(priceNewProduct(productInfo));
      productInfo.newPrice = newPrice;

      //Add title price to item
      const totalPrice = newPrice * item.quantity;
      item.totalPrice = totalPrice;

      item.productInfo = productInfo;
    }
  }

  cart.totalPrice = cart.products.reduce((total, item) => {
    return total + item.totalPrice;
  }, 0);

  res.render("client/pages/checkout/index", {
    pageTitle: "Thanh toán",
    cartDetail: cart,
  });
};

// [POST] /checkout/order
export const order = async (req: Request, res: Response) => {
  const cartId: string = req.cookies.cartId;
  const userInfo = req.body;

  // Get product in cart
  const cart: ICart = await Cart.findOne({
    _id: cartId,
  });

  let products = [];

  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };

    const productInfo: IProduct = await Product.findOne({
      _id: product.product_id,
    });

    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;

    products.push(objectProduct);
  }

  const objectOrder = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
    paymentType: "Thanh toán khi nhận hàng",
    payment: false,
  };

  try {
    const order = new Order(objectOrder) as IOrder;
    await order.save();

    // Giảm số lượng products đã thay đổi
    for (const product of order.products) {
      const productInfo: IProduct = await Product.findOne({
        _id: product.product_id,
      });
      const newStock = productInfo.stock - product.quantity;
      await Product.updateOne(
        {
          _id: product.product_id,
        },
        {
          stock: newStock,
        }
      );
    }

    // Clear cart
    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        products: [],
      }
    );

    res.redirect(`/checkout/success/${order.id}`);
  } catch (error) {
    console.log(error);
  }
};

// [GET] /checkout/success/:orderId
export const success = async (req: Request, res: Response) => {
  const order: IOrder = await Order.findOne({
    _id: req.params.orderId,
  });

  for (let product of order.products) {
    const productInfo: IProduct = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail");

    product.productInfo = productInfo;

    product.newPrice = parseInt(priceNewProduct(product));
    product.totalPriceProduct = product.newPrice * product.quantity;
  }

  order.totalPriceCart = order.products.reduce((sum, item) => {
    return sum + item.totalPriceProduct;
  }, 0);

  // send mail to user
  try {
    // get token user from cookie
    const tokenUser = req.cookies.tokenUser;
    const user: IUser = await User.findOne({
      tokenUser: tokenUser,
      deleted: false,
    });

    // Gửi thông báo qua email
    const subject = "Đặt hàng thành công!";
    let rows = "";
    for (let i = 0; i < order.products.length; i++) {
      let product = order.products[i];
      rows += `
        <tr>
            <td style="border: 1px solid black;" class="align-middle">${
              i + 1
            }</td>
            <td style="border: 1px solid black;" class="align-middle"><img src="${
              product.productInfo.thumbnail
            }" alt="${product.productInfo.title}" width="80px"></td>
            <td style="border: 1px solid black;" class="align-middle">${
              product.productInfo.title
            }</td>
            <td style="border: 1px solid black;" class="align-middle">${
              product.newPrice
            }$</td>
            <td style="border: 1px solid black;" class="align-middle">${
              product.quantity
            }</td>
            <td style="border: 1px solid black;" class="align-middle">${
              product.totalPriceProduct
            }$</td>
        </tr>
    `;
    }

    const html = `
    Đơn hàng của bạn đã được đặt thành công. Chúng tôi sẽ xử lý đơn hàng và bàn giao cho đơn vị vận chuyển trong thời gian sớm nhất.
    <h4 class="mb-2">Thông tin chi tiết đơn hàng của bạn</h4>
    <table class="table text-center" style="width: 100%; border: 1px solid black; border-collapse: collapse;">
        <thead>
            <tr style="border: 1px solid black;" class="align-middle">
                <th style="border: 1px solid black;">STT</th>
                <th style="border: 1px solid black;">Ảnh</th>
                <th style="border: 1px solid black;">Tên sản phẩm</th>
                <th style="border: 1px solid black;">Đơn giá</th>
                <th style="border: 1px solid black;">Số lượng</th>
                <th style="border: 1px solid black;">Thành tiền</th>
            </tr>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>
    <h3 class="text-right font-weight-bold text-success">Tổng tiền: ${order.totalPriceCart}$</h3>
`;
    sendMail(user.email, subject, html);
  } catch (error) {
    console.log(error);
  }

  res.render("client/pages/checkout/checkout-success", {
    pageTitle: "Bạn đã đặt hàng thành công",
    order: order,
  });
};

export const createPaymentUrl = async (req: Request, res: Response) => {
  // create Order
  const cartId: string = req.cookies.cartId;
  const userInfo = req.body;

  // Get product in cart
  const cart: ICart = await Cart.findOne({
    _id: cartId,
  });

  let products = [];

  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };

    const productInfo: IProduct = await Product.findOne({
      _id: product.product_id,
    });

    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;

    products.push(objectProduct);
  }

  const objectOrder = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
    paymentType: "Thanh toán quan VNPay",
    payment: false,
  };

  let order: IOrder;
  try {
    order = new Order(objectOrder) as IOrder;
    await order.save();

    // Giảm số lượng products đã thay đổi
    for (const product of order.products) {
      const productInfo: IProduct = await Product.findOne({
        _id: product.product_id,
      });
      const newStock = productInfo.stock - product.quantity;
      await Product.updateOne(
        {
          _id: product.product_id,
        },
        {
          stock: newStock,
        }
      );
    }

    // Clear cart
    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        products: [],
      }
    );
  } catch (error) {
    console.log(error);
  }
  // end create Order

  const totalPrice = parseInt(req.body.totalPrice);
  const orderInfo = req.body.cartDetail;
  process.env.TZ = "Asia/Ho_Chi_Minh";

  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  // let ipAddr =
  //   req.headers["x-forwarded-for"] ||
  //   req.connection.remoteAddress ||
  //   req.socket.remoteAddress ||
  //   req.connection.socket.remoteAddress;

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    "127.0.0.1";

  let tmnCode = process.env.vnp_TmnCode;
  let secretKey = process.env.vnp_HashSecret;
  let vnpUrl = process.env.vnp_Url;
  let returnUrl = process.env.vnp_ReturnUrl;
  let orderId = order.id;
  let amount = totalPrice * 1000;
  let bankCode = "NCB";

  let locale = "vn";

  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr as string;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);
  console.log(vnp_Params);

  let signData = qs.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + qs.stringify(vnp_Params, { encode: false });

  res.redirect(vnpUrl);
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export const vnpayReturn = async (req: Request, res: Response) => {
  let vnp_Params = req.query;

  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let config = require("config");
  let tmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    // Lấy id đơn hàng từ `vnp_Params`
    let orderId = vnp_Params["vnp_TxnRef"];
    // Tìm đơn hàng trong cơ sở dữ liệu dựa trên `orderId`
    let order: IOrder = await Order.findById(orderId);

    if (order) {
      // thông tin chi tiết đơn hàng để in ra giao diên
      for (let product of order.products) {
        const productInfo: IProduct = await Product.findOne({
          _id: product.product_id,
        }).select("title thumbnail");

        product.productInfo = productInfo;

        product.newPrice = parseInt(priceNewProduct(product));
        product.totalPriceProduct = product.newPrice * product.quantity;
      }

      order.totalPriceCart = order.products.reduce((sum, item) => {
        return sum + item.totalPriceProduct;
      }, 0);

      // Kiểm tra xem trạng thái thanh toán của đơn hàng có phải là 'chưa thanh toán' hay không
      if (order.payment === false) {
        // Cập nhật trạng thái thanh toán của đơn hàng
        order.payment = true;
        await order.save();

        // send mail to user
        try {
          // get token user from cookie
          const tokenUser = req.cookies.tokenUser;
          const user: IUser = await User.findOne({
            tokenUser: tokenUser,
            deleted: false,
          });

          // Gửi thông báo qua email
          const subject = "Thanh toán đơn hàng thành công!";
          let rows = "";
          for (let i = 0; i < order.products.length; i++) {
            let product = order.products[i];
            rows += `
              <tr>
                  <td style="border: 1px solid black;" class="align-middle">${
                    i + 1
                  }</td>
                  <td style="border: 1px solid black;" class="align-middle"><img src="${
                    product.productInfo.thumbnail
                  }" alt="${product.productInfo.title}" width="80px"></td>
                  <td style="border: 1px solid black;" class="align-middle">${
                    product.productInfo.title
                  }</td>
                  <td style="border: 1px solid black;" class="align-middle">${
                    product.newPrice
                  }$</td>
                  <td style="border: 1px solid black;" class="align-middle">${
                    product.quantity
                  }</td>
                  <td style="border: 1px solid black;" class="align-middle">${
                    product.totalPriceProduct
                  }$</td>
              </tr>
          `;
          }

          const html = `
          Đơn hàng của bạn đã được thanh toán thành công. Chúng tôi sẽ xử lý đơn hàng và bàn giao cho đơn vị vận chuyển trong thời gian sớm nhất.
          <h4 class="mb-2">Thông tin chi tiết đơn hàng của bạn</h4>
          <table class="table text-center" style="width: 100%; border: 1px solid black; border-collapse: collapse;">
              <thead>
                  <tr style="border: 1px solid black;" class="align-middle">
                      <th style="border: 1px solid black;">STT</th>
                      <th style="border: 1px solid black;">Ảnh</th>
                      <th style="border: 1px solid black;">Tên sản phẩm</th>
                      <th style="border: 1px solid black;">Đơn giá</th>
                      <th style="border: 1px solid black;">Số lượng</th>
                      <th style="border: 1px solid black;">Thành tiền</th>
                  </tr>
              </thead>
              <tbody>
                  ${rows}
              </tbody>
          </table>
          <h3 class="text-right font-weight-bold text-success">Tổng tiền: ${order.totalPriceCart}$</h3>
      `;
          sendMail(user.email, subject, html);
        } catch (error) {
          console.log(error);
        }

        res.render("client/pages/checkout/checkout-vnpay-success", {
          code: vnp_Params["vnp_ResponseCode"],
          order,
        });
      } else {
        // Đơn hàng đã được thanh toán trước đó hoặc trạng thái đơn hàng không hợp lệ
        res.render("client/pages/checkout/checkout-vnpay-success", {
          code: "01", // Mã lỗi tùy ý, ví dụ: "01" nghĩa là "Đơn hàng không hợp lệ"
        });
      }
    } else {
      // Đơn hàng không tồn tại
      res.render("client/pages/checkout/checkout-vnpay-success", {
        code: "02", // Mã lỗi tùy ý, ví dụ: "02" nghĩa là "Đơn hàng không tồn tại"
      });
    }
  } else {
    res.render("client/pages/checkout/checkout-vnpay-success", { code: "97" });
  }
};

export const vnpayIpn = async (req: Request, res: Response) => {
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  let orderInfo = vnp_Params["vnp_TxnRef"];
  let rspCode = vnp_Params["vnp_ResponseCode"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  let secretKey = process.env.vnp_HashSecret;
  let signData = qs.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  let paymentStatus = "0"; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

  let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if (secureHash === signed) {
    //kiểm tra checksum
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus == "0") {
          //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
          if (rspCode == "00") {
            //thanh cong
            //paymentStatus = '1'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
            res.status(200).json({ RspCode: "00", Message: "Success" });
          } else {
            //that bai
            //paymentStatus = '2'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
            res.status(200).json({ RspCode: "00", Message: "Success" });
          }
        } else {
          res.status(200).json({
            RspCode: "02",
            Message: "This order has been updated to the payment status",
          });
        }
      } else {
        res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
      }
    } else {
      res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }
  } else {
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
  }
};
