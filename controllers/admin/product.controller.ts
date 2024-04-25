import { Request, Response } from "express";
import Product from "../../models/product.model";
import ProductCategory from "../../models/product-category.model";
import filterStatusHelper from "../../helpers/filterStatus";
import searchHelper from "../../helpers/search";
import pagination from "../../helpers/pagination";
import tree from "../../helpers/createTree";

// [GET] /admin/products
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
  const countProduct = await Product.countDocuments(find);
  const objPagination = pagination(req.query, countProduct);

  const products = await Product.find(find)
    .sort({ position: "desc" })
    .limit(objPagination.limitItems)
    .skip(objPagination.skip);

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
    await Product.updateOne({ _id: id }, { status: status });
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
      { deleted: true, deletedAt: Date.now() }
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
  interface IFind {
    deleted: boolean;
  }

  let find: IFind = {
    deleted: false,
  };

  const category = await ProductCategory.find(find);

  const newCategory = tree(category);

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

    //Upload thumbnail
    // if (req.file) {
    //   req.body.thumbnail = `uploads/${req.file.filename}`;
    // }

    const product = new Product(req.body);
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
    interface IFind {
      deleted: boolean;
      _id: string;
    }

    const id: string = req.params.id;
    const find: IFind = {
      deleted: false,
      _id: id,
    };

    const product = await Product.findOne(find);

    //Lấy ra danh mục sản phẩm
    const category = await ProductCategory.find({ deleted: false });
    const newCategory = tree(category);

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

    await Product.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", `Cập nhật sản phẩm thành công!`);
  } catch (error) {
    req.flash("success", `Cập nhật sản phẩm thất bại!`);
  }
  res.redirect("/admin/products");
};

// [GET] /admin/products/detail/:id
export const detail = async (req: Request, res: Response) => {
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

    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect("/admin/products");
  }
};
