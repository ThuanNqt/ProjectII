"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vnpayIpn = exports.vnpayReturn = exports.createPaymentUrl = exports.success = exports.order = exports.index = void 0;
const cart_model_1 = __importDefault(require("../../models/cart.model"));
const product_model_1 = __importDefault(require("../../models/product.model"));
const product_1 = require("../../helpers/product");
const order_model_1 = __importDefault(require("../../models/order.model"));
const qs_1 = __importDefault(require("qs"));
const crypto_1 = __importDefault(require("crypto"));
const moment_1 = __importDefault(require("moment"));
const sendEmail_1 = require("../../helpers/sendEmail");
const user_model_1 = __importDefault(require("../../models/user.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield cart_model_1.default.findOne({
        _id: req.cookies.cartId,
    });
    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id;
            const productInfo = yield product_model_1.default.findOne({
                _id: productId,
            });
            const newPrice = parseInt((0, product_1.priceNewProduct)(productInfo));
            productInfo.newPrice = newPrice;
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
});
exports.index = index;
const order = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;
    const cart = yield cart_model_1.default.findOne({
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
        const productInfo = yield product_model_1.default.findOne({
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
        status: "prepare",
    };
    try {
        const order = new order_model_1.default(objectOrder);
        yield order.save();
        for (const product of order.products) {
            const productInfo = yield product_model_1.default.findOne({
                _id: product.product_id,
            });
            const newStock = productInfo.stock - product.quantity;
            yield product_model_1.default.updateOne({
                _id: product.product_id,
            }, {
                stock: newStock,
            });
        }
        yield cart_model_1.default.updateOne({
            _id: cartId,
        }, {
            products: [],
        });
        res.redirect(`/checkout/success/${order.id}`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.order = order;
const success = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.default.findOne({
        _id: req.params.orderId,
    });
    for (let product of order.products) {
        const productInfo = yield product_model_1.default.findOne({
            _id: product.product_id,
        }).select("title thumbnail");
        product.productInfo = productInfo;
        product.newPrice = parseInt((0, product_1.priceNewProduct)(product));
        product.totalPriceProduct = product.newPrice * product.quantity;
    }
    order.totalPriceCart = order.products.reduce((sum, item) => {
        return sum + item.totalPriceProduct;
    }, 0);
    try {
        const tokenUser = req.cookies.tokenUser;
        const user = yield user_model_1.default.findOne({
            tokenUser: tokenUser,
            deleted: false,
        });
        const subject = "Đặt hàng thành công!";
        let rows = "";
        for (let i = 0; i < order.products.length; i++) {
            let product = order.products[i];
            rows += `
        <tr>
            <td style="border: 1px solid black;" class="align-middle">${i + 1}</td>
            <td style="border: 1px solid black;" class="align-middle"><img src="${product.productInfo.thumbnail}" alt="${product.productInfo.title}" width="80px"></td>
            <td style="border: 1px solid black;" class="align-middle">${product.productInfo.title}</td>
            <td style="border: 1px solid black;" class="align-middle">${product.newPrice}</td>
            <td style="border: 1px solid black;" class="align-middle">${product.quantity}</td>
            <td style="border: 1px solid black;" class="align-middle">${product.totalPriceProduct}</td>
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
    <h3 class="text-right font-weight-bold text-success">Tổng tiền: ${order.totalPriceCart}</h3>
`;
        (0, sendEmail_1.sendMail)(user.email, subject, html);
    }
    catch (error) {
        console.log(error);
    }
    res.render("client/pages/checkout/checkout-success", {
        pageTitle: "Bạn đã đặt hàng thành công",
        order: order,
    });
});
exports.success = success;
const createPaymentUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;
    const cart = yield cart_model_1.default.findOne({
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
        const productInfo = yield product_model_1.default.findOne({
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
        status: "prepare",
    };
    let order;
    try {
        order = new order_model_1.default(objectOrder);
        yield order.save();
        for (const product of order.products) {
            const productInfo = yield product_model_1.default.findOne({
                _id: product.product_id,
            });
            const newStock = productInfo.stock - product.quantity;
            yield product_model_1.default.updateOne({
                _id: product.product_id,
            }, {
                stock: newStock,
            });
        }
        yield cart_model_1.default.updateOne({
            _id: cartId,
        }, {
            products: [],
        });
    }
    catch (error) {
        console.log(error);
    }
    const totalPrice = parseInt(req.body.totalPrice);
    const orderInfo = req.body.cartDetail;
    process.env.TZ = "Asia/Ho_Chi_Minh";
    let date = new Date();
    let createDate = (0, moment_1.default)(date).format("YYYYMMDDHHmmss");
    let ipAddr = req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        "127.0.0.1";
    let tmnCode = process.env.vnp_TmnCode;
    let secretKey = process.env.vnp_HashSecret;
    let vnpUrl = process.env.vnp_Url;
    let returnUrl = process.env.vnp_ReturnUrl;
    let orderId = order.id;
    let amount = totalPrice;
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
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
        vnp_Params["vnp_BankCode"] = bankCode;
    }
    vnp_Params = sortObject(vnp_Params);
    console.log(vnp_Params);
    let signData = qs_1.default.stringify(vnp_Params, { encode: false });
    let hmac = crypto_1.default.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + qs_1.default.stringify(vnp_Params, { encode: false });
    res.redirect(vnpUrl);
});
exports.createPaymentUrl = createPaymentUrl;
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
const vnpayReturn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        let orderId = vnp_Params["vnp_TxnRef"];
        let order = yield order_model_1.default.findById(orderId);
        if (order) {
            for (let product of order.products) {
                const productInfo = yield product_model_1.default.findOne({
                    _id: product.product_id,
                }).select("title thumbnail");
                product.productInfo = productInfo;
                product.newPrice = parseInt((0, product_1.priceNewProduct)(product));
                product.totalPriceProduct = product.newPrice * product.quantity;
            }
            order.totalPriceCart = order.products.reduce((sum, item) => {
                return sum + item.totalPriceProduct;
            }, 0);
            if (order.payment === false) {
                order.payment = true;
                yield order.save();
                try {
                    const tokenUser = req.cookies.tokenUser;
                    const user = yield user_model_1.default.findOne({
                        tokenUser: tokenUser,
                        deleted: false,
                    });
                    const subject = "Thanh toán đơn hàng thành công!";
                    let rows = "";
                    for (let i = 0; i < order.products.length; i++) {
                        let product = order.products[i];
                        rows += `
              <tr>
                  <td style="border: 1px solid black;" class="align-middle">${i + 1}</td>
                  <td style="border: 1px solid black;" class="align-middle"><img src="${product.productInfo.thumbnail}" alt="${product.productInfo.title}" width="80px"></td>
                  <td style="border: 1px solid black;" class="align-middle">${product.productInfo.title}</td>
                  <td style="border: 1px solid black;" class="align-middle">${product.newPrice}</td>
                  <td style="border: 1px solid black;" class="align-middle">${product.quantity}</td>
                  <td style="border: 1px solid black;" class="align-middle">${product.totalPriceProduct}</td>
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
          <h3 class="text-right font-weight-bold text-success">Tổng tiền: ${order.totalPriceCart}</h3>
      `;
                    (0, sendEmail_1.sendMail)(user.email, subject, html);
                }
                catch (error) {
                    console.log(error);
                }
                res.render("client/pages/checkout/checkout-vnpay-success", {
                    code: vnp_Params["vnp_ResponseCode"],
                    order,
                });
            }
            else {
                res.render("client/pages/checkout/checkout-vnpay-success", {
                    code: "01",
                });
            }
        }
        else {
            res.render("client/pages/checkout/checkout-vnpay-success", {
                code: "02",
            });
        }
    }
    else {
        res.render("client/pages/checkout/checkout-vnpay-success", { code: "97" });
    }
});
exports.vnpayReturn = vnpayReturn;
const vnpayIpn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];
    let orderInfo = vnp_Params["vnp_TxnRef"];
    let rspCode = vnp_Params["vnp_ResponseCode"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    vnp_Params = sortObject(vnp_Params);
    let secretKey = process.env.vnp_HashSecret;
    let signData = qs_1.default.stringify(vnp_Params, { encode: false });
    let hmac = crypto_1.default.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    let paymentStatus = "0";
    let checkOrderId = true;
    let checkAmount = true;
    if (secureHash === signed) {
        if (checkOrderId) {
            if (checkAmount) {
                if (paymentStatus == "0") {
                    if (rspCode == "00") {
                        res.status(200).json({ RspCode: "00", Message: "Success" });
                    }
                    else {
                        res.status(200).json({ RspCode: "00", Message: "Success" });
                    }
                }
                else {
                    res.status(200).json({
                        RspCode: "02",
                        Message: "This order has been updated to the payment status",
                    });
                }
            }
            else {
                res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
            }
        }
        else {
            res.status(200).json({ RspCode: "01", Message: "Order not found" });
        }
    }
    else {
        res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
    }
});
exports.vnpayIpn = vnpayIpn;
