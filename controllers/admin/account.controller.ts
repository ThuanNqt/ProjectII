import Account from "../../models/account.model";
import Role from "../../models/role.model";
import md5 from "md5";
import { Request, Response } from "express";

interface IFind {
  deleted: boolean;
}

interface IAccount {
  fullName: String;
  password: String;
  email: String;
  token: string;
  phone: String;
  avatar: String;
  role_id: String;
  role?: IRole;
  status: String;
  deleted: boolean;
  deletedAt: Date;
}

interface IRole {
  title: String;
  description: String;
  permissions: string[];
  deleted: boolean;
  deletedAt: Date;
}

//[GET] /admin/accounts
export const index = async (req: Request, res: Response) => {
  let find: IFind = {
    deleted: false,
  };

  // Tìm kiếm loại trừ đi password và token
  const records: IAccount[] = await Account.find(find).select(
    "-password -token"
  );

  // Lấy role của account thay vì in ra role_id thì ta in ra role.title
  for (let record of records) {
    let role: IRole = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.role = role;
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};

//[GET] /admin/accounts/create
export const create = async (req: Request, res: Response) => {
  try {
    let find: IFind = {
      deleted: false,
    };

    const roles: IRole[] = await Role.find(find);

    res.render("admin/pages/accounts/create", {
      pageTitle: "Tạo tài khoản",
      roles: roles,
    });
  } catch (error) {}
};

//[POST] /admin/accounts/create
export const createPost = async (req: Request, res: Response) => {
  try {
    const emailExist = await Account.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (emailExist) {
      req.flash("error", `Email ${req.body.email} đã tồn tại`);
      res.redirect("back");
      return;
    } else {
      // Mã hóa mật khẩu
      req.body.password = md5(req.body.password);

      const record = new Account(req.body);
      await record.save();
      req.flash("success", "Tạo tài khoản thành công");
    }
  } catch (error) {
    req.flash("error", "Tạo tài khoản thất bại");
  }
  res.redirect(`/admin/accounts`);
};
