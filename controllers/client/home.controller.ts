import { Request, Response } from "express";
import Product from "../../models/product.model";
import { priceNewProducts } from "../../helpers/product";

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

interface IFind {
  featured: string;
  deleted: boolean;
  status: string;
}

// [GET] /
export const index = async (req: Request, res: Response) => {
  const find: IFind = {
    featured: "1",
    deleted: false,
    status: "active",
  };

  const productsFeatured = await Product.find(find).limit(6);

  const newProducts: IProduct[] = priceNewProducts(productsFeatured);

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProducts,
  });
};
