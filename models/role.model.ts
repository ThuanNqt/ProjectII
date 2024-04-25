import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    permissions: {
      type: Array,
      default: ["Thêm sản phẩm", "Xóa sản phẩm"],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema, "roles");
export default Role;
