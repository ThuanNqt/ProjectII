import { Request, Response } from "express";
import Product from "../../models/product.model";

export const index = async (req: Request, res: Response) => {
  //Truyền động cho front-end các bản ghi ra giao diện
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: "",
    },
  ];

  //Tính năng làm sáng nút trạng thái đang được chọn
  if (req.query.status) {
    const index = filterStatus.findIndex(
      (item) => item.status === req.query.status
    );
    filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex((item) => item.status === "");
    filterStatus[index].class = "active";
  }

  interface IFind {
    deleted: boolean;
    status?: string;
  }

  const find: IFind = {
    deleted: false,
  };

  //Nếu có trạng thái thì thêm điều kiện tìm kiếm
  if (req.query.status) {
    find.status = req.query.status.toString();
  }

  console.log(req.query.status);

  const products = await Product.find(find);
  console.log(products);

  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
  });
};
