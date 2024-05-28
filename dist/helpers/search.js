"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const searchHelper = (query) => {
    const objSearch = {
        keyword: "",
        regex: "",
    };
    if (query.keyword) {
        objSearch.keyword = query.keyword;
        objSearch.regex = RegExp(objSearch.keyword, "i");
    }
    return objSearch;
};
exports.default = searchHelper;
