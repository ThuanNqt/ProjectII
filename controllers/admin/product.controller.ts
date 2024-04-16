import { Request, Response } from "express";
import Product from "../../models/product.model";
import filterStatusHelper from "../../helpers/filterStatus";
import searchHelper from "../../helpers/search";

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

  const products = await Product.find(find);

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objSearch.keyword,
  });
};
