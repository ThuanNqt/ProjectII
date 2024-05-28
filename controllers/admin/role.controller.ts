import searchHelper from "../../helpers/search";
import Account from "../../models/account.model";
import Role from "../../models/role.model";
import { Request, Response } from "express";

interface IRole {
  title: string;
  description: string;
  permissions: string[];
  deleted: boolean;
  deletedAt: Date;
}

interface IFind {
  _id?: string;
  deleted: boolean;
  status?: string;
  title?: RegExp | string;
}

interface IAccount {
  fullName: string;
  password: string;
  email: string;
  token: string;
  phone: string;
  avatar: string;
  role_id: string;
  status: string;
  deleted: boolean;
  deletedAt: Date;
}

// [GET] /admin/roles
export const index = async (req: Request, res: Response) => {
  let find: IFind = {
    deleted: false,
  };

  // Search products by keyword
  const objSearch = searchHelper(req.query);
  if (req.query.keyword) {
    find.title = objSearch.regex;
  }

  const records: IRole[] = await Role.find(find);

  res.render("admin/pages/roles/index", {
    pageTitle: "Trang nhóm quyền",
    records: records,
  });
};

// [GET] /admin/roles/create
export const create = (req: Request, res: Response) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Trang tạo nhóm quyền",
  });
};

// [POST] /admin/roles/create
export const createPost = async (req: Request, res: Response) => {
  try {
    const record = new Role(req.body);
    await record.save();
    req.flash("success", `Tạo quyền thành công!`);
  } catch (error) {
    req.flash("error", `Tạo quyền thất bại!`);
  }
  res.redirect(`/admin/roles`);
};

// [DELETE] /admin/roles/delete/:id
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // Kiểm tra tài khoản đang chứa quyền đó
    const account: IAccount = await Account.findOne({ role_id: id });
    if (account) {
      req.flash("error", `Một số tài khoản đang có quyền này!`);
      return res.redirect(`back`);
    }

    await Role.updateOne({ _id: id }, { deleted: true });
    req.flash("success", `Xóa nhóm quyền thành công!`);
  } catch (error) {
    req.flash("error", `Xóa nhóm quyền thất bại!`);
  }
  res.redirect(`/admin/roles`);
};

// [GET] /admin/roles/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const role: IRole = await Role.findOne(find);
    res.render(`admin/pages/roles/detail`, {
      pageTitle: role.title,
      role: role,
    });
  } catch (error) {
    res.redirect(`/admin/roles`);
  }
};

// [GET] /admin/roles/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const find: IFind = {
      deleted: false,
      _id: req.params.id,
    };

    const role: IRole = await Role.findOne(find);
    res.render(`admin/pages/roles/edit`, {
      pageTitle: role.title,
      role: role,
    });
  } catch (error) {
    res.redirect(`/admin/roles`);
  }
};

// [PATCH] /admin/roles/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    await Role.updateOne({ _id: req.params.id }, req.body);
    res.redirect("/admin/roles");
    req.flash("success", `Cập nhật quyền thành công!`);
  } catch (error) {
    req.flash("error", `Cập nhật quyền thất bại!`);
  }
};

// [GET] /admin/roles/permissions
export const permissions = async (req: Request, res: Response) => {
  try {
    const find: IFind = {
      deleted: false,
    };

    const records: IRole[] = await Role.find(find);

    res.render("admin/pages/roles/permissions", {
      pageTitle: "Trang phân quyền",
      records: records,
    });
  } catch (error) {
    console.log(error);
  }
};

// [PATCH] /admin/roles/permissions
export const permissionsPatch = async (req: Request, res: Response) => {
  try {
    const permissions = JSON.parse(req.body.permissions); // convert JSON to JS
    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    req.flash("success", "Phân quyền thành công!");
  } catch (error) {
    req.flash("error", "Phân quyền thất bại!");
  }
  res.redirect("back");
};
