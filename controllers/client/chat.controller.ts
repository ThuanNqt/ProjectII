import { Request, Response } from "express";
import Chat from "../../models/chat.model";
import User from "../../models/user.model";

interface Chat {
  user_id: string;
  room_chat_id?: string;
  content: string;
  images?: string[];
  deleted?: boolean;
  deletedAt?: Date;
  save?: Promise<Chat>;
  infoUser?: string;
}

// [GET] /chat
export const index = async (req: Request, res: Response) => {
  const userId: string = res.locals.user.id;
  const fullName: string = res.locals.user.fullName;

  if (global._io) {
    global._io.once("connection", (socket) => {
      socket.on("CLIENT_SEND_MESSAGE", async (content) => {
        // save to database
        const chat = new Chat({
          user_id: userId,
          content: content,
        });

        await chat.save();

        // send data to Client
        global._io.emit("SERVER_RETURN_MESSAGE", {
          userId: userId,
          fullName: fullName,
          content: content,
        });
      });
    });
  }

  // get all message
  const chats = (await Chat.find({
    deleted: false,
  })) as Chat[];

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");

    chat.infoUser = infoUser.fullName;
  }

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
  });
};
