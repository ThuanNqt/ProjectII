import { Request, Response } from "express";
import Product from "../../models/product.model";
import ProductCategory from "../../models/product-category.model";
import { priceNewProducts, priceNewProduct } from "../../helpers/product";
import { getSubCategory } from "../../helpers/product-category";
import OrderRating from "../../models/order-rating.model";
import User from "../../models/user.model";

interface IProduct {
  _id: string;
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
  averageRating: number;
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

interface ISort {
  [sortKey: string]: string;
  position?: string;
}

interface IUser {
  _id: string;
  fullName: string;
  password: string;
  email: string;
  tokenUser: string;
  phone: string;
  avatar: string;
  status: string;
  deleted: boolean;
  deletedAt: Date;
}

interface IOrderRating {
  user?: string;
  user_id: string;
  order_id: string;
  products: {
    product_id: string;
    rating: number;
    comment: string;
  };
}

// [GET] /products
export const index = async (req: Request, res: Response) => {
  const find: IFind = {
    status: "active",
    deleted: false,
  };

  // Sort
  const sort: ISort = {};
  if (
    typeof req.query.sortKey === "string" &&
    typeof req.query.sortValue === "string"
  ) {
    const sortKey: string = req.query.sortKey;
    const sortValue: string = req.query.sortValue;
    sort[sortKey] = sortValue;
  } else {
    sort.title = "asc";
  }
  // End sort

  const products = await Product.find(find).sort(sort as any);

  const newProducts: IProduct[] = priceNewProducts(products) as IProduct[];

  if (sort) {
    newProducts.sort((a, b) => {
      if (sort["price"] === "desc") {
        return b.newPrice - a.newPrice; // Giả sử mỗi sản phẩm trong newProducts đã có trường newPrice
      } else if (sort["price"] === "asc") {
        return a.newPrice - b.newPrice;
      }
    });
  }

  // Range price
  let productsRange: IProduct[] = newProducts;
  if (req.query.priceMin || req.query.priceMax) {
    const priceMin = parseInt(req.query.priceMin as string);
    const priceMax = parseInt(req.query.priceMax as string);
    productsRange = newProducts.filter((product) => {
      return product.newPrice >= priceMin && product.newPrice <= priceMax;
    });
  }

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: productsRange,
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

    if (product) {
      const productRating = await OrderRating.find({
        "products.product_id": product._id,
      });

      let totalRating = 0;
      let ratingCount = 0;

      for (const rating of productRating) {
        totalRating += rating.products.rating;
        ratingCount += 1;
      }
      const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;
      product.averageRating = averageRating;
    }

    // Get all products of category
    const productsOfCategory: IProduct[] = await Product.find({
      deleted: false,
      status: "active",
      product_category_id: product.product_category_id,
      slug: { $ne: product.slug },
    });

    if (productsOfCategory) {
      for (const product of productsOfCategory) {
        product.newPrice = parseInt(await priceNewProduct(product));
        const productRating = await OrderRating.find({
          "products.product_id": product._id,
        });

        let totalRating = 0;
        let ratingCount = 0;

        for (const rating of productRating) {
          totalRating += rating.products.rating;
          ratingCount += 1;
        }
        const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;
        product.averageRating = averageRating;
      }
    }

    // const ratingOfUserCurrent: IOrderRating = await OrderRating.findOne({
    //   "products.product_id": product._id,
    //   user_id: user._id,
    // });

    // const ratingOfUserOther: IOrderRating = await OrderRating.findOne({
    //   "products.product_id": product._id,
    //   user_id: { $ne: user._id },
    // });

    const ratingOfUser: IOrderRating[] = await OrderRating.find({
      "products.product_id": product._id,
    });

    if (ratingOfUser) {
      for (const rating of ratingOfUser) {
        rating.user = await User.findOne({ _id: rating.user_id });
      }
    }

    res.render(`client/pages/products/detail`, {
      pageTitle: product.title,
      product: product,
      productsOfCategory: productsOfCategory,
      ratingOfUser: ratingOfUser.reverse(),
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
