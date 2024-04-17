import { Request, Response } from "express";
import Product from "../../models/product.model";

interface IProduct {
  title: String;
  description: String;
  price: Number;
  discountPercentage: Number;
  stock: Number;
  thumbnail: String;
  status: String;
  position: Number;
  deleted: Boolean;
  newPrice?: number;
}

export const index = async (req: Request, res: Response) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = products.map((product) => {
    const newProduct: IProduct = {
      ...product.toObject(), // Assuming that product is a mongoose document, we need to convert it to a plain object
      newPrice: parseInt(
        (
          product.price -
          product.price * (product.discountPercentage / 100)
        ).toFixed(0) // Fixed to two decimal places if needed
      ),
    };
    return newProduct;
  });

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
  });
};
