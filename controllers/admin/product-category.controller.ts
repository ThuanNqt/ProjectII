import ProductCategory from "../../models/product-category.model";
import filterStatusHelper from "../../helpers/filterStatus";
import searchHelper from "../../helpers/search";
import pagination from "../../helpers/pagination";
import { Request, Response } from "express";

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

  const productCategories = await ProductCategory.find(find)
    .sort({ position: "desc" })
    .limit(objPagination.limitItems)
    .skip(objPagination.skip);

  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: productCategories,
    filterStatus: filterStatus,
    keyword: objSearch.keyword,
    pagination: objPagination,
  });
};

// [GET] /admin/products-category/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
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
  } catch (error) {
    console.log(error);
  }
  res.redirect("/admin/products-category");
};

// [PATCH] /admin/products-category/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status: string = req.params.status;
    const id: string = req.params.id;
    await ProductCategory.updateOne({ _id: id }, { status: status });
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
  }

  //Trả về trang trước đó => đáp ứng việc thay đổi trạng thái sản phẩm mà không cần load lại trang
  res.redirect("back");
};
