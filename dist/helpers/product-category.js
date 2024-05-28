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
exports.getSubCategory = void 0;
const product_category_model_1 = __importDefault(require("../models/product-category.model"));
const getCategory = (parentId) => __awaiter(void 0, void 0, void 0, function* () {
    const findSubs = {
        parent_id: parentId,
        deleted: false,
        status: "active",
    };
    const subs = yield product_category_model_1.default.find(findSubs);
    let allSub = [...subs];
    for (let sub of subs) {
        const childs = yield getCategory(sub.id);
        allSub = allSub.concat(childs);
    }
    return allSub;
});
const getSubCategory = (parentId) => __awaiter(void 0, void 0, void 0, function* () {
    const subs = yield getCategory(parentId);
    return subs;
});
exports.getSubCategory = getSubCategory;
