import { Request, Response } from "express";

// [GET] /chat
export const index = (req: Request, res: Response) => {
  global._io.on("connection", (socket) => {
    console.log(`a user connected`, socket.id);
  });

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
  });
};
