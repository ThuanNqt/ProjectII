import Cart from "../../models/cart.model";
import { Request, Response } from "express";
import Product from "../../models/product.model";
import { priceNewProduct } from "../../helpers/product";
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

// [GET] /cart
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

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};

// [POST] /cart/add/:productId
export const addPost = async (req: Request, res: Response) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);

  const cart: ICart = await Cart.findOne({ _id: cartId });
  const existProductInCart = cart.products.find(
    (item) => item.product_id == productId
  );

  if (existProductInCart) {
    const newQuantity = existProductInCart.quantity + quantity;
    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        "products.$.quantity": newQuantity,
      }
    );
  } else {
    let objectCart = {
      product_id: productId,
      quantity: quantity,
    };

    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $push: { products: objectCart },
      }
    );
  }

  req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công");
  res.redirect("back");
};

// [GET] /cart/delete/:productId
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $pull: { products: { product_id: productId } },
      }
    );

    req.flash("success", "Xóa sản phẩm khỏi giỏ hàng thành công");
  } catch (error) {
    req.flash("error", "Xóa sản phẩm khỏi giỏ hàng thất bại");
  }
  res.redirect("back");
};
