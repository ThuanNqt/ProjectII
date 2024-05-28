import ProductCategory from "../../models/product-category.model";
import filterStatusHelper from "../../helpers/filterStatus";
import searchHelper from "../../helpers/search";
import pagination from "../../helpers/pagination";
import { Request, Response } from "express";
import tree from "../../helpers/createTree";
import Product from "../../models/product.model";

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
  _id?: string;
  deleted: boolean;
  status?: string;
  title?: RegExp | string;
}

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

// [GET] /admin/products-category
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

  // Pagination
  const countProduct = await ProductCategory.countDocuments(find);

  const productCategories = (await ProductCategory.find(find).sort({
    position: "desc",
  })) as ICategory[];

  // Phân cấp danh mục sản phẩm
  const newRecords: ICategory[] = tree(productCategories);

  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
    filterStatus: filterStatus,
    keyword: objSearch.keyword,
  });
};

// [GET] /admin/products-category/create
export const create = async (req: Request, res: Response) => {
  let find: IFind = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  // Phân cấp danh mục sản phẩm
  const newRecords: ICategory[] = tree(records);

  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords,
  });
};

// [POST] /admin/products-category/create
export const createPost = async (req: Request, res: Response) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position === "") {
      const countProduct = await ProductCategory.countDocuments();
      req.body.position = countProduct + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    //Upload thumbnail
    // if (req.file) {
    //   req.body.thumbnail = `uploads/${req.file.filename}`;
    // }

    const productCategory = new ProductCategory(req.body);
    await productCategory.save();
    req.flash("success", `Tạo danh mục thành công!`);
  } catch (error) {
    req.flash("error", `Tạo danh mục thất bại!`);
  }
  res.redirect("/admin/products-category");
};

// [PATCH] /admin/products-category/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status: string = req.params.status;
    const id: string = req.params.id;
    await ProductCategory.updateOne({ _id: id }, { status: status });
    req.flash("success", `Thay đổi trạng thái thành công!`);
  } catch (error) {
    req.flash("error", `Thay đổi trạng thái thất bại!`);
  }

  res.redirect("back");
};

// [DELETE] /admin/products-category/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    // Kiểm tra xem danh mục có chứa danh mục con không
    const categoryChild: ICategory = await ProductCategory.findOne({
      parent_id: id,
      deleted: false,
    });

    // Nếu danh mục đang chứa sản phẩm
    const product: IProduct = await Product.findOne({
      product_category_id: id,
      deleted: false,
    });

    if (categoryChild) {
      req.flash("error", `Danh mục này đang chứa một số danh mục con!`);
      return res.redirect("back");
    }

    if (product) {
      req.flash("error", `Danh mục này đang chứa một số sản phẩm!`);
      return res.redirect("back");
    }

    await ProductCategory.updateOne(
      { _id: id },
      { deleted: true, deletedAt: Date.now() }
    );
    req.flash("success", `Xóa danh mục thành công!`);
  } catch (error) {
    req.flash("error", `Xóa danh mục thất bại!`);
  }

  //Trả về trang trước đó => đáp ứng việc thay đổi trạng thái sản phẩm mà không cần load lại trang
  res.redirect("back");
};

// [GET] /admin/products-category/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    interface IFind {
      deleted: boolean;
      _id: string;
    }

    const id: string = req.params.id;

    const find: IFind = {
      deleted: false,
      _id: id,
    };

    const productCategory: ICategory = await ProductCategory.findOne(find);

    // Phân cấp danh mục sản phẩm
    const records: ICategory[] = await ProductCategory.find({ deleted: false });
    const newRecords: ICategory[] = tree(records);

    res.render(`admin/pages/products-category/edit`, {
      pageTitle: "Chỉnh sửa sản phẩm",
      data: productCategory,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`/admin/products-category`);
  }
};

// [PATCH] /admin/products-category/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    req.body.position = parseInt(req.body.position);

    await ProductCategory.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", `Cập nhật danh mục thành công!`);
  } catch (error) {
    req.flash("success", `Cập nhật danh mục thất bại!`);
  }
  res.redirect("/admin/products-category");
};

// [GET] /admin/products-category/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const find: IFind = {
      deleted: false,
      _id: id,
    };

    const productCategory: ICategory = await ProductCategory.findOne(find);

    // Phân cấp danh mục sản phẩm
    const titleProductCategory: ICategory = await ProductCategory.findOne({
      deleted: false,
      _id: productCategory.parent_id,
    });

    res.render(`admin/pages/products-category/detail`, {
      pageTitle: productCategory.title,
      productCategory: productCategory,
      titleProductCategory: titleProductCategory,
    });
  } catch (error) {
    res.redirect(`/admin/products-category`);
  }
};
