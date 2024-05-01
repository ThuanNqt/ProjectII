import { Request, Response } from "express";
import Product from "../../models/product.model";
import ProductCategory from "../../models/product-category.model";
import { priceNewProducts } from "../../helpers/product";
import { getSubCategory } from "../../helpers/product-category";
import { get } from "mongoose";

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

// [GET] /products/:slugCategory
export const category = async (req: Request, res: Response) => {
  try {
    const slug: string = req.params.slugCategory;
    console.log(slug);

    // Lấy ra danh mục mà người dùng chọn
    const findSlugCategory: IFind = {
      slug: slug,
      deleted: false,
      status: "active",
    };

    const category = await ProductCategory.findOne(findSlugCategory).exec();
    console.log(category);

    // Từ danh mục mà người dùng chọn, lấy ra tất cả danh mục con của nó
    const productCategory = await getSubCategory(category.id);
    const productCategoryIds = productCategory.map((item) => item.id);

    // Lấy ra tất cả sản phẩm thuộc danh mục mà người dùng chọn và các sản phẩm thuộc danh mục con của nó
    const products = await Product.find({
      deleted: false,
      status: "active",
      product_category_id: { $in: [category.id, ...productCategoryIds] },
    }).sort({ position: "desc" });

    const newProducts = await priceNewProducts(products);

    res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: newProducts,
    });
  } catch (error) {
    res.redirect(`/products`);
  }
};
