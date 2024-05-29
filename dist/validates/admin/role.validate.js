"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRole = void 0;
const createRole = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", "Vui lòng nhập tên quyền");
        res.redirect("back");
        return;
    }
    next();
};
exports.createRole = createRole;
