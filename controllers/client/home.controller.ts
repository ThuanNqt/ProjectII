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

const limitItem: number = 6;

// [GET] /
export const index = async (req: Request, res: Response) => {
  // Get 6 products featured
  const findProductsFeatured: IFind = {
    featured: "1",
    deleted: false,
    status: "active",
  };

  const productsFeatured = await Product.find(findProductsFeatured).limit(
    limitItem
  );

  const newProductsFeatured: IProduct[] = priceNewProducts(productsFeatured);

  // Get products new
  const findProductsNew = {
    deleted: false,
    status: "active",
  };

  const productsNew = await Product.find(findProductsNew)
    .sort({ position: "desc" })
    .limit(limitItem);

  const newProductsNew: IProduct[] = priceNewProducts(productsNew);

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
  });
};
