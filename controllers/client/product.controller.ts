import { Request, Response } from "express";
import Product from "../../models/product.model";
import ProductCategory from "../../models/product-category.model";
import { priceNewProducts, priceNewProduct } from "../../helpers/product";
import { getSubCategory } from "../../helpers/product-category";

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
  category?: ICategory;
}

interface ICategory {
  title: string;
  parent_id: string;
  description: string;
  thumbnail: string;
  status: string;
  position: number;
  slug: string;
  deleted: boolean;
  deletedAt: Date;
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

  const newProducts: IProduct[] = priceNewProducts(products) as IProduct[];

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
  });
};

// [GET] /products/detail/:slugProduct
export const detail = async (req: Request, res: Response) => {
  try {
    const slug: string = req.params.slugProduct;

    const find: IFind = {
      deleted: false,
      slug: slug,
      status: "active",
    };

    const product: IProduct = await Product.findOne(find);

    //Lấy ra danh mục sản phẩm
    if (product.product_category_id) {
      const category: ICategory = await ProductCategory.findOne({
        _id: product.product_category_id,
        status: "active",
        deleted: false,
      });
      product.category = category;
    }

    product.newPrice = parseInt(await priceNewProduct(product));

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

    // Lấy ra danh mục mà người dùng chọn
    const findSlugCategory: IFind = {
      slug: slug,
      deleted: false,
      status: "active",
    };

    const category = await ProductCategory.findOne(findSlugCategory).exec();

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
