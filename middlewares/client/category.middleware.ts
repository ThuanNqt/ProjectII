import ProductCategory from "../../models/product-category.model";
import tree from "../../helpers/createTree";
import { Request, Response, NextFunction } from "express";

interface IFind {
  deleted: boolean;
}

export const category = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const find: IFind = {
    deleted: false,
  };
  const productsCategory = await ProductCategory.find(find);

  const newProductsCategory = tree(productsCategory);

  // Tạo ra một biến toàn cục để sử dụng ở bất kỳ đâu
  res.locals.layoutProductsCategory = newProductsCategory;
  next();
};
