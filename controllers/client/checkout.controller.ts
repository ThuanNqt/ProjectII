import Cart from "../../models/cart.model";
import Product from "../../models/product.model";
import { priceNewProduct } from "../../helpers/product";
import { Request, Response } from "express";
import Order from "../../models/order.model";

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
  title: String;
  product_category_id: string;
  description: String;
  price: Number;
  newPrice?: number;
  discountPercentage: Number;
  stock: Number;
  thumbnail: String;
  status: String;
  featured: String;
  position: Number;
  deleted: boolean;
  deletedAt: Date;
  slug: string;
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
