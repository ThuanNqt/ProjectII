import Cart from "../../models/cart.model";
import { Request, Response, NextFunction } from "express";

interface ICart {
  id?: string;
  save?(): unknown;
  user_id?: string;
  products: IProductCart[];
  totalQuantity?: number;
}

interface IProductCart {
  product_id: string;
  quantity: number;
}

export const cartId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  if (!req.cookies.cartId) {
    let cart: ICart | null;
    if (user) {
      // Nếu người dùng đã đăng nhập, tìm giỏ hàng liên kết với tài khoản của họ
      cart = await Cart.findOne({ user_id: user.id });
      if (!cart) {
        // Nếu không tìm thấy giỏ hàng, tạo một giỏ hàng mới và liên kết với người dùng
        cart = new Cart({ user_id: user.id }) as ICart;
        await cart.save();
      }
    } else {
      // Nếu không có thông tin người dùng, tạo một giỏ hàng mới cho phiên ẩn danh
      cart = new Cart() as ICart;
      await cart.save();
    }
    // Set hoặc cập nhật cookie với ID giỏ hàng
    const expiresTime = 1000 * 60 * 60 * 24 * 365; // 1 year
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresTime),
      httpOnly: true, // Cài đặt thêm các cờ bảo mật cho cookie
    });
  } else {
    const cart: ICart | null = await Cart.findOne({ _id: req.cookies.cartId });

    // Check if cart is not null
    if (cart) {
      // Now safe to assume cart is not null and access its properties
      cart.totalQuantity = cart.products.reduce(
        (total, item) => total + item.quantity,
        0
      );
      res.locals.miniCart = cart;
    } else {
      // Handle the case where no cart is found. For example:
      // Initialize miniCart with default values or similar action
      res.locals.miniCart = { products: [], totalQuantity: 0 };
    }
  }
  next();
};
