"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_slug_updater_1 = __importDefault(require("mongoose-slug-updater"));
mongoose_1.default.plugin(mongoose_slug_updater_1.default);
const productCategorySchema = new mongoose_1.default.Schema({
    title: String,
    parent_id: {
        type: String,
        default: "",
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: { type: String, slug: "title", unique: true },
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
}, {
    timestamps: true,
});
const ProductCategory = mongoose_1.default.model("ProductCategory", productCategorySchema, "products-category");
exports.default = ProductCategory;
