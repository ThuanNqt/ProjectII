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

  // Đã tồn tại sản phẩm đó trong giỏ hàng
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

  req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");
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

    req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng");
  } catch (error) {
    req.flash("error", "Xóa sản phẩm khỏi giỏ hàng thất bại");
  }
  res.redirect("back");
};

// [PATCH] /cart/update/:productId/:quantity
export const updateQuantity = async (req: Request, res: Response) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.params.quantity);
    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        "products.$.quantity": quantity,
      }
    );
    req.flash("success", "Thay đổi số lượng thành công");
  } catch (error) {
    req.flash("error", "Thay đổi số lượng thất bại");
  }
  res.redirect("back");
};
