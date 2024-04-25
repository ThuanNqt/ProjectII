import Role from "../../models/role.model";
import { Request, Response } from "express";

// [GET] /admin/roles
export const index = async (req: Request, res: Response) => {
  interface IFind {
    deleted: boolean;
  }

  let find: IFind = {
    deleted: false,
  };

  const records = await Role.find(find);

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
    req.flash("success", `Tạo nhóm quyền thành công!`);
  } catch (error) {
    req.flash("error", `Tạo nhóm quyền thất bại!`);
  }

  res.redirect(`/admin/roles`);
};

// [DELETE] /admin/roles/delete/:id
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
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

    const role = await Role.findOne(find);
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
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const role = await Role.findOne(find);
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
    req.flash("success", `Cập nhật thành công!`);
  } catch (error) {
    req.flash("error", `Cập nhật thất bại!`);
  }
};

// [GET] /admin/roles/permissions
export const permissions = async (req: Request, res: Response) => {
  try {
    interface IFind {
      deleted: boolean;
    }
    const find: IFind = {
      deleted: false,
    };

    const records = await Role.find(find);

    res.render("admin/pages/roles/permissions", {
      pageTitle: "Trang phân quyền",
      records: records,
    });
  } catch (error) {
    console.log(error);
  }
};

// [PATCH] /admin/roles/permissions
export const permissionsPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions); // convert JSON to JS
    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }
  res.redirect("back");
};
