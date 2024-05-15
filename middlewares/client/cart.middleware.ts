// import Cart from "../../models/cart.model";
// import { Request, Response, NextFunction } from "express";

// interface ICart {
//   user_id?: string;
//   products: IProductCart[];
//   totalQuantity?: number;
// }

// interface IProductCart {
//   product_id: string;
//   quantity: number;
// }

// export const cartId = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (!req.cookies.cartId) {
//     const cart = new Cart();
//     await cart.save();

//     const expiresTime = 1000 * 60 * 60 * 24 * 365;
//     res.cookie("cartId", cart.id, {
//       expires: new Date(Date.now() + expiresTime),
//     });
//   } else {
//     const cart: ICart | null = await Cart.findOne({ _id: req.cookies.cartId });
//     cart.totalQuantity = cart.products.reduce(
//       (total, item) => total + item.quantity,
//       0
//     );
//     res.locals.miniCart = cart;
//   }
//   next();
// };

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

    const expiresTime = 1000 * 60 * 60 * 24 * 365; // 1 year
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresTime),
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
