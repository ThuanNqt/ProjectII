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

interface IOrder {
  totalPriceCart?: number;
  save?(): Promise<IOrder>;
  id: string;
  cart_id: string,
    userInfo: {
      fullName: string,
      phone: string,
      address: string,
    },
    products:
      {
        totalPriceProduct?: number;
        newPrice?: number;
        productInfo?: IProduct;
        product_id: string,
        quantity: number,
        price: number,
        discountPercentage: number,
      }[],
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

// [POST] /checkout/order
export const order = async (req:Request, res:Response) => {
  const cartId:string = req.cookies.cartId;
  const userInfo = req.body;

  // Get product in cart
  const cart:ICart = await Cart.findOne({
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

    const productInfo:IProduct = await Product.findOne({
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
  };

  const order:IOrder = new Order(objectOrder) as IOrder;
  await order.save();

  // Clear cart
  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      products: [],
      // Giảm số lượng products đã thay đổi
    }
  );

  res.redirect(`/checkout/success/${order.id}`);
};

// [GET] /checkout/success/:orderId
export const success = async (req:Request, res:Response) => {
  const order:IOrder = await Order.findOne({
    _id: req.params.orderId,
  });

  for (let product of order.products) {
    const productInfo:IProduct = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail");

    product.productInfo = productInfo;

    product.newPrice =  parseInt(priceNewProduct(product))
    product.totalPriceProduct = product.newPrice * product.quantity;
  }

  order.totalPriceCart = order.products.reduce((sum, item) => {
    return sum + item.totalPriceProduct;
  }, 0);

  res.render("client/pages/checkout/checkout-success", {
    pageTitle: "Thanh toán thành công",
    order: order,
  });
};