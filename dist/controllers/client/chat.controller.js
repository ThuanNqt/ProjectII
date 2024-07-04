"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const index = (req, res) => {
    global._io.on("connection", (socket) => {
        console.log(`a user connected`, socket.id);
    });
    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
    });
};
exports.index = index;
