import { priceNewProduct } from "../../helpers/product";
import { Request, Response } from "express";
import Order from "../../models/order.model";
import Product from "../../models/product.model";
import OrderShipping from "../../models/order-shipping.model";

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
  status?: string;
  deleted?: boolean;
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

interface IOrderShipping {
  order_id: string;
  shipName: string;
  shipPhone: string;
  save?(): Promise<IOrderShipping>;
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
    orders: orders.reverse(),
  });
};

// [POST] /admin/order/process-shipping
export const orderShipping = async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.body.order_id });
    if (!order) {
      req.flash("error", "Đơn hàng không tồn tại");
      res.redirect("back");
      return;
    }

    await Order.updateOne({ _id: req.body.order_id }, { status: "shipping" });

    const shipperInfo = new OrderShipping(req.body) as IOrderShipping;
    await shipperInfo.save();

    req.flash("success", "Đơn hàng đã được gửi");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Có lỗi xảy ra");
    res.redirect("back");
  }
};
