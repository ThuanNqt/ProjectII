"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const chat_model_1 = __importDefault(require("../../models/chat.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    if (global._io) {
        global._io.once("connection", (socket) => {
            socket.on("CLIENT_SEND_MESSAGE", (content) => __awaiter(void 0, void 0, void 0, function* () {
                const chat = new chat_model_1.default({
                    user_id: userId,
                    content: content,
                });
                yield chat.save();
                global._io.emit("SERVER_RETURN_MESSAGE", {
                    userId: userId,
                    fullName: fullName,
                    content: content,
                });
            }));
        });
    }
    const chats = (yield chat_model_1.default.find({
        deleted: false,
    }));
    for (const chat of chats) {
        const infoUser = yield user_model_1.default.findOne({
            _id: chat.user_id,
        }).select("fullName");
        chat.infoUser = infoUser.fullName;
    }
    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats,
    });
});
exports.index = index;
