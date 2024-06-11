import { priceNewProduct } from "../../helpers/product";
import { Request, Response } from "express";
import Order from "../../models/order.model";
import Product from "../../models/product.model";

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

// [GET] /admin/order
export const index = async (req: Request, res: Response) => {
  const orders: IOrder[] = await Order.find();

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
  }

  res.render("admin/pages/orders/index", {
    orders,
  });
};
