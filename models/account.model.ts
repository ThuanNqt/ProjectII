import mongoose from "mongoose";
import * as generate from "../helpers/generate";

const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    password: String,
    email: String,
    token: {
      type: String,
      default: generate.generateRandomString(20),
    },
    phone: String,
    avatar: String,
    role_id: String,
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Account = mongoose.model("Account", accountSchema, "accounts");
export default Account;
