import Account from "../../models/account.model";
import Role from "../../models/role.model";
import md5 from "md5";
import { Request, Response } from "express";
import filterStatusHelper from "../../helpers/filterStatus";
import searchHelper from "../../helpers/search";

interface IFind {
  _id?: string;
  deleted: boolean;
  status?: string;
  fullName?: RegExp | string;
}

interface IAccount {
  fullName: string;
  password: string;
  email: string;
  token: string;
  phone: string;
  avatar: string;
  role_id: string;
  role?: IRole;
  status: string;
  deleted: boolean;
  deletedAt: Date;
}

interface IRole {
  title: string;
  description: string;
  permissions: string[];
  deleted: boolean;
  deletedAt: Date;
}

//[GET] /admin/accounts
export const index = async (req: Request, res: Response) => {
  let find: IFind = {
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
    find.fullName = objSearch.regex;
  }

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
    filterStatus: filterStatus,
    keyword: objSearch.keyword,
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
  } catch (error) {
    console.log(error);
  }
};

//[POST] /admin/accounts/create
export const createPost = async (req: Request, res: Response) => {
  try {
    const emailExist: IAccount = await Account.findOne({
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

//[DELETE] /admin/accounts/delete/:id
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    await Account.updateOne(
      { _id: id },
      { deleted: true, deletedAt: Date.now() }
    );

    req.flash("success", `Xóa tài khoản thành công!`);
  } catch (error) {
    req.flash("error", `Xóa tài khoản thất bại!`);
  }

  res.redirect("back");
};

// [PATCH] /admin/accounts/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const status: string = req.params.status;
    const id: string = req.params.id;

    await Account.updateOne({ _id: id }, { status: status });

    req.flash("success", "Cập nhật trạng thái tài khoản thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái tài khoản thất bại!");
  }

  res.redirect("back");
};

// [GET] /admin/accounts/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const find: IFind = {
      deleted: false,
      _id: req.params.id,
    };

    const record: IAccount = await Account.findOne(find).select(
      "-password -token"
    );

    // Lấy role của account thay vì in ra role_id thì ta in ra role.title
    let role: IRole = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });

    record.role = role;
    // End lấy role của account

    res.render(`admin/pages/accounts/detail`, {
      pageTitle: record.fullName,
      record: record,
    });
  } catch (error) {
    res.redirect(`/admin/accounts`);
  }
};

// [GET] /admin/accounts/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const find: IFind = {
      deleted: false,
      _id: req.params.id,
    };

    const account: IAccount = await Account.findOne(find);

    const roles: IRole[] = await Role.find({ deleted: false });

    res.render(`admin/pages/accounts/edit`, {
      pageTitle: "Chỉnh sửa tài khoản",
      account: account,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`/admin/accounts`);
  }
};

// [PATCH] /admin/products/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const emailExist: IAccount = await Account.findOne({
      email: req.body.email,
      deleted: false,
      _id: { $ne: req.params.id }, // Không kiểm tra email của chính record đang sửa
    });

    if (emailExist) {
      req.flash("error", `Email ${req.body.email} đã tồn tại`);
      res.redirect("back");
      return;
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password);
      }
      await Account.updateOne({ _id: req.params.id }, req.body);
      req.flash("success", "Cập nhật tài khoản thành công!");
      res.redirect("/admin/accounts");
    }
  } catch (error) {
    req.flash("error", "Cập nhật tài khoản thất bại!");
    res.redirect(`/admin/accounts`);
  }
};
