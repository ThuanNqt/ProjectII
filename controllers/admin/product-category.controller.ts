import ProductCategory from "../../models/product-category.model";
import filterStatusHelper from "../../helpers/filterStatus";
import searchHelper from "../../helpers/search";
import pagination from "../../helpers/pagination";
import { Request, Response } from "express";
import tree from "../../helpers/createTree";

// [GET] /admin/products-category
export const index = async (req: Request, res: Response) => {
  interface IFind {
    deleted: boolean;
    status?: string;
    title?: RegExp | string;
  }

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
  const objPagination = pagination(req.query, countProduct);

  const productCategories = await ProductCategory.find(find).sort({
    position: "desc",
  });
  // .limit(objPagination.limitItems)
  // .skip(objPagination.skip);

  // Phân cấp danh mục sản phẩm
  const newRecords = tree(productCategories);

  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
    filterStatus: filterStatus,
    keyword: objSearch.keyword,
    pagination: objPagination,
  });
};

// [GET] /admin/products-category/create
export const create = async (req: Request, res: Response) => {
  interface IFind {
    deleted: boolean;
  }

  let find: IFind = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);

  // Phân cấp danh mục sản phẩm
  const newRecords = tree(records);

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

    const productCategory = await ProductCategory.findOne(find);

    // Phân cấp danh mục sản phẩm
    const records = await ProductCategory.find({ deleted: false });
    const newRecords = tree(records);

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
  req.body.position = parseInt(req.body.position);

  try {
    await ProductCategory.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", `Cập nhật thành công!`);
  } catch (error) {
    req.flash("success", `Cập nhật thất bại!`);
  }
  res.redirect("/admin/products-category");
};

// [GET] /admin/products-category/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    interface IFind {
      deleted: boolean;
      _id: string;
    }

    const id = req.params.id;

    const find: IFind = {
      deleted: false,
      _id: id,
    };

    const productCategory = await ProductCategory.findOne(find);

    // Phân cấp danh mục sản phẩm
    const titleProductCategory = await ProductCategory.findOne({
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
