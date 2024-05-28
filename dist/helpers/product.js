"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceNewProduct = exports.priceNewProducts = void 0;
const priceNewProducts = (products) => {
    const newProducts = products.map((product) => {
        product.newPrice = ((product.price * (100 - product.discountPercentage)) /
            100).toFixed(0);
        return product;
    });
    return newProducts;
};
exports.priceNewProducts = priceNewProducts;
const priceNewProduct = (product) => {
    const newPrice = ((product.price * (100 - product.discountPercentage)) /
        100).toFixed(0);
    return newPrice;
};
exports.priceNewProduct = priceNewProduct;
