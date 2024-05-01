import Cart from "../../models/cart.model";
import { Request, Response, NextFunction } from "express";

interface ICart {
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
    const cart = new Cart();
    await cart.save();

    const expiresTime = 1000 * 60 * 60 * 24 * 365;
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresTime),
    });
  } else {
    const cart: ICart = await Cart.findOne({ _id: req.cookies.cartId });
    cart.totalQuantity = cart.products.reduce(
      (total, item) => total + item.quantity,
      0
    );
    res.locals.miniCart = cart;
  }
  next();
};
