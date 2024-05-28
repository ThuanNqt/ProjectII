import { Request, Response } from "express";
import Product from "../../models/product.model";
import Account from "../../models/account.model";
import ProductCategory from "../../models/product-category.model";
import filterStatusHelper from "../../helpers/filterStatus";
import searchHelper from "../../helpers/search";
import pagination from "../../helpers/pagination";
import tree from "../../helpers/createTree";
import { priceNewProduct } from "../../helpers/product";

interface IProduct {
  title: string;
  product_category_id?: string;
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
  createdBy?: {
    account_id?: string;
    createdAt?: Date;
  };
  deletedBy?: {
    account_id?: string;
    deletedAt?: Date;
  };
  updatedBy?: {
    account_id?: string;
    updatedAt?: Date;
    accountEditFullName?: string;
  }[];
  accountFullName?: string;
  save?(): Promise<IProduct>;
  category?: ICategory;
}

interface IFind {
  _id?: string;
  deleted: boolean;
  status?: string;
  title?: RegExp | string;
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

// [GET] /admin/products
export const index = async (req: Request, res: Response) => {
  const find: IFind = {
    deleted: false,
  };

  // filter status
  const filterStatus = filterStatusHelper(req.query);

  // If there is a status, add search conditions
  if (req.query.status) {
    find.status = req.query.status.toString();
  }

  // Search products by keyword
  const objSearch = searchHelper(req.query);
  if (req.query.keyword) {
    find.title = objSearch.regex;
  }

  // Sort
  interface ISort {
    [sortKey: string]: string;
    position?: string;
  }
  const sort: ISort = {};
  if (
    typeof req.query.sortKey === "string" &&
    typeof req.query.sortValue === "string"
  ) {
    const sortKey: string = req.query.sortKey;
    const sortValue: string = req.query.sortValue;
    sort[sortKey] = sortValue;
  } else {
    sort.position = "desc";
  }
  // End sort

  // Pagination
  const countProduct = await Product.countDocuments(find);
  const objPagination = pagination(req.query, countProduct);

  const products: IProduct[] = (await Product.find(find)
    .sort(sort as any)
    .limit(objPagination.limitItems)
    .skip(objPagination.skip)) as IProduct[];

  for (const product of products) {
    const createdByAccount = await Account.findOne({
      _id: product.createdBy.account_id,
    });

    if (createdByAccount) {
      product.accountFullName = createdByAccount.fullName;
    }

    const lastUpdatedByAccount = product.updatedBy.slice(-1)[0];
    if (lastUpdatedByAccount) {
      const userUpdated = await Account.findOne({
        _id: lastUpdatedByAccount.account_id,
      });
      lastUpdatedByAccount.accountEditFullName = userUpdated.fullName;
    }
  }

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objSearch.keyword,
    pagination: objPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status: string = req.params.status;
    const id: string = req.params.id;

    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: Date.now(),
    };

    await Product.updateOne(
      { _id: id },
      {
        status: status,
        $push: {
          updatedBy: updatedBy,
        },
      }
    );

    req.flash("success", "Cập nhật trạng thái thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái thất bại!");
  }

  res.redirect("back");
};

// [DELETE] /admin/products/delete/:id
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    await Product.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: Date.now(),
        },
      }
    );
    req.flash("success", "Xóa sản phẩm thành công!");
  } catch (error) {
    req.flash("success", "Xóa sản phẩm thất bại!");
  }

  //Trả về trang trước đó => đáp ứng việc thay đổi trạng thái sản phẩm mà không cần load lại trang
  res.redirect("back");
};

// [GET] /admin/products/create
export const create = async (req: Request, res: Response) => {
  let find: IFind = {
    deleted: false,
  };

  const category: ICategory[] = await ProductCategory.find(find);

  const newCategory: ICategory[] = tree(category);

  res.render("admin/pages/products/create", {
    pageTitle: "Thêm sản phẩm",
    category: newCategory,
  });
};

// [POST] /admin/products/create
export const createPost = async (req: Request, res: Response) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position === "") {
      const countProduct = await Product.countDocuments();
      req.body.position = countProduct + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
      account_id: res.locals.user.id,
    };

    const product: IProduct = new Product(req.body) as IProduct;
    await product.save();

    req.flash("success", `Tạo sản phẩm thành công!`);
  } catch (error) {
    req.flash("success", `Tạo sản phẩm thất bại!`);
  }
  res.redirect("/admin/products");
};

// [GET] /admin/products/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const find: IFind = {
      deleted: false,
      _id: id,
    };

    const product: IProduct = await Product.findOne(find);

    //Lấy ra danh mục sản phẩm
    const category: ICategory[] = await ProductCategory.find({
      deleted: false,
    });
    const newCategory: ICategory[] = tree(category);

    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory,
    });
  } catch (error) {
    console.log(error);
  }
};

// [PATCH] /admin/products/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.stock = parseInt(req.body.stock);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.position = parseInt(req.body.position);

    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: Date.now(),
    };

    await Product.updateOne(
      { _id: req.params.id },
      {
        ...req.body,
        $push: {
          updatedBy: updatedBy,
        },
      }
    );

    req.flash("success", `Cập nhật sản phẩm thành công!`);
  } catch (error) {
    req.flash("success", `Cập nhật sản phẩm thất bại!`);
  }
  res.redirect("/admin/products");
};

// [GET] /admin/products/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const find: IFind = {
      deleted: false,
      _id: id,
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

    product.newPrice = parseInt(priceNewProduct(product));

    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect("/admin/products");
  }
};
