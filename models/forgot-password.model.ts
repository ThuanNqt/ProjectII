import mongoose from "mongoose";

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    OTP: String,
    expireAt: Date,
  },
  {
    timestamps: true,
  }
);

const ForgotPassword = mongoose.model(
  "ForgotPassword",
  forgotPasswordSchema,
  "forgot-password"
);
export default ForgotPassword;
