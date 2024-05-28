"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let count = 0;
const createTree = (arr, parentId = "") => {
    const tree = [];
    arr.forEach((item) => {
        if (item.parent_id === parentId) {
            ++count;
            const newItem = item;
            newItem.index = count;
            const children = createTree(arr, item.id);
            if (children.length) {
                newItem.children = children;
            }
            tree.push(newItem);
        }
    });
    return tree;
};
const tree = (arr, parentId = "") => {
    count = 0;
    const tree = createTree(arr, (parentId = ""));
    return tree;
};
exports.default = tree;
