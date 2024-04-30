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
  deleted: boolean;
  slug?: string;
  status: string;
}

// [GET] /products
export const index = async (req: Request, res: Response) => {
  const find: IFind = {
    status: "active",
    deleted: false,
  };

  const products = await Product.find(find).sort({ position: "desc" });

  const newProducts: IProduct[] = priceNewProducts(products);

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
  });
};

// [GET] /products/:slug
export const detail = async (req: Request, res: Response) => {
  try {
    const slug: string = req.params.slug;

    const find: IFind = {
      deleted: false,
      slug: slug,
      status: "active",
    };

    const product = await Product.findOne(find);

    res.render(`client/pages/products/detail`, {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};
