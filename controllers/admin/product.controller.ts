import { Request, Response } from "express";
import Product from "../../models/product.model";
import filterStatusHelper from "../../helpers/filterStatus";
import searchHelper from "../../helpers/search";
import pagination from "../../helpers/pagination";
import Swal from "sweetalert2";

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
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
  }

  //Trả về trang trước đó => đáp ứng việc thay đổi trạng thái sản phẩm mà không cần load lại trang
  res.redirect("back");
};
