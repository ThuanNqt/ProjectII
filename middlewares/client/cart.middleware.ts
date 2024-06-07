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
  if (!req.cookies.cartId) {
    let cart: ICart = await Cart.findOne({ user_id: null });
    if (!cart) {
      cart = new Cart() as ICart;
      await cart.save();
    }
    res.cookie("cartId", cart.id);
  } else {
    const cart: ICart = await Cart.findOne({ _id: req.cookies.cartId });
    if (cart) {
      // Cập nhật số lượng và thông tin miniCart
      cart.totalQuantity = cart.products.reduce(
        (total, item) => total + item.quantity,
        0
      );
      res.locals.miniCart = cart;
    } else {
      // Xử lý trường hợp không tìm thấy giỏ hàng từ cookie cartId
      res.locals.miniCart = { products: [], totalQuantity: 0 };
    }
  }

  next();
};
