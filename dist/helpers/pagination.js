"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pagination = (query, countProduct) => {
    const objPagination = {
        currentPage: 1,
        limitItems: 3,
    };
    if (query.page) {
        objPagination.currentPage = parseInt(query.page.toString());
    }
    objPagination.skip =
        (objPagination.currentPage - 1) * objPagination.limitItems;
    const totalPage = Math.ceil(countProduct / objPagination.limitItems);
    objPagination.totalPage = totalPage;
    return objPagination;
};
exports.default = pagination;
