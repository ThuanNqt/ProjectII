import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/checkout.controller";
import { requireAuth } from "../../middlewares/client/auth.middleware";

//Routes home
router.get("/", controller.index);

router.post("/order", requireAuth, controller.order);

// Thêm route để tạo URL thanh toán VNPay
router.post("/create_payment_url", requireAuth, controller.createPaymentUrl);

// Thêm route để xử lý kết quả trả về từ VNPay
router.get("/vnpay_return", requireAuth, controller.vnpayReturn);

// Thêm đường dẫn để xử lý IPN từ VNPAY
router.get("/vnpay_ipn", requireAuth, controller.vnpayIpn);

router.get("/success/:orderId", requireAuth, controller.success);

export const checkoutRoutes: Router = router;
