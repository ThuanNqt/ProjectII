import { Request, Response } from "express";
import Product from "../../models/product.model";

export const index = async (req: Request, res: Response) => {
  const products = await Product.find({
    deleted: false,
  });

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
  });
};
