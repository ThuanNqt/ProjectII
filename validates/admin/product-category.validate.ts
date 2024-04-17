import { NextFunction, Request, Response } from "express";

export const createPost = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.title) {
    res.redirect("back");
    return;
  }
  next();
};
