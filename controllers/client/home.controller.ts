import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
  });
};
