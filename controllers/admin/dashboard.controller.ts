import { Request, Response } from "express";
import ProductCategory from "../../models/product-category.model";
import Product from "../../models/product.model";
import Account from "../../models/account.model";
import User from "../../models/user.model";
import Role from "../../models/role.model";
import Order from "../../models/order.model";

export const dashboard = async (req: Request, res: Response) => {
  const statistic = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    role: {
      total: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    order: {
      total: 0,
      bestSellingProduct: [],
    },
  };

  //Product-category
  statistic.categoryProduct.total = await ProductCategory.countDocuments({
    deleted: false,
  });

  statistic.categoryProduct.active = await ProductCategory.countDocuments({
    deleted: false,
    status: "active",
  });
  statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
    deleted: false,
    status: "inactive",
  });

  //Product
  statistic.product.total = await Product.countDocuments({
    deleted: false,
  });

  statistic.product.active = await Product.countDocuments({
    deleted: false,
    status: "active",
  });
  statistic.product.inactive = await Product.countDocuments({
    deleted: false,
    status: "inactive",
  });

  // Role
  statistic.role.total = await Role.countDocuments({
    deleted: false,
  });

  // Account
  statistic.account.total = await Account.countDocuments({
    deleted: false,
  });

  statistic.account.active = await Account.countDocuments({
    deleted: false,
    status: "active",
  });
  statistic.account.inactive = await Account.countDocuments({
    deleted: false,
    status: "inactive",
  });

  // User
  statistic.user.total = await User.countDocuments({
    deleted: false,
  });

  statistic.user.active = await User.countDocuments({
    deleted: false,
    status: "active",
  });
  statistic.user.inactive = await User.countDocuments({
    deleted: false,
    status: "inactive",
  });

  // Order
  statistic.order.total = await Order.countDocuments();
  statistic.order.bestSellingProduct = await Order.aggregate([
    { $unwind: "$products" }, // Làm phẳng mảng products
    {
      $group: {
        _id: "$products.product_id", // Nhóm theo product_id
        count: { $sum: 1 }, // Đếm số lượng
      },
    },
    { $sort: { count: -1 } }, // Sắp xếp giảm dần theo số lượng
    { $limit: 5 }, // Lấy sản phẩm xuất hiện nhiều nhất
  ]);

  for (const product of statistic.order.bestSellingProduct) {
    const productInfo = await Product.findOne({ _id: product._id });
    product.title = productInfo.title;
  }

  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tổng quan",
    statistic: statistic,
  });
};
