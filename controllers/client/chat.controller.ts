import { Request, Response } from "express";

// [GET] /chat
export const index = (req: Request, res: Response) => {
  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
  });
};
