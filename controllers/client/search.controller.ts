import Product from "../../models/product.model";
import { priceNewProducts } from "../../helpers/product";
import { Request, Response } from "express";

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

//[GET] /search
export const index = async (req: Request, res: Response) => {
  // Ensure that keyword is a string before using it
  const keyword =
    typeof req.query.keyword === "string" ? req.query.keyword : "";
  let newProducts: IProduct[] = [];

  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");

    const products = await Product.find({
      title: keywordRegex,
      status: "active",
      deleted: false,
    });

    newProducts = (await priceNewProducts(products)) as IProduct[];
  }
  res.render("client/pages/search/index", {
    pageTitle: "Kết quả tìm kiếm",
    keyword: keyword,
    products: newProducts,
  });
};
