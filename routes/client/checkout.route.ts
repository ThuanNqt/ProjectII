import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/checkout.controller";

//Routes home
router.get("/", controller.index);

router.post("/order", controller.order);

// Thêm route để tạo URL thanh toán VNPay
router.post("/create_payment_url", controller.createPaymentUrl);

// Thêm route để xử lý kết quả trả về từ VNPay
router.get("/vnpay_return", controller.vnpayReturn);

// Thêm đường dẫn để xử lý IPN từ VNPAY
router.get("/vnpay_ipn", controller.vnpayIpn);

router.get("/success/:orderId", controller.success);

export const checkoutRoutes: Router = router;
