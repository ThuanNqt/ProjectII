"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = void 0;
const createPost = (req, res, next) => {
    if (!req.body.title) {
        res.redirect("back");
        return;
    }
    next();
};
exports.createPost = createPost;
