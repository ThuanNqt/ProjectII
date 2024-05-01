import Cart from "../../models/cart.model";
import { Request, Response } from "express";

interface ICart {
  user_id?: string;
  products: IProductCart[];
}

interface IProductCart {
  product_id: string;
  quantity: number;
}

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
