"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMoney = void 0;
const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};
exports.formatMoney = formatMoney;
