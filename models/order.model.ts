import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    cart_id: String,
    userInfo: {
      fullName: String,
      phone: String,
      address: String,
    },
    products: [
      {
        product_id: String,
        quantity: Number,
        price: Number,
        discountPercentage: Number,
      },
    ],
    paymentType: String,
    payment: Boolean,
    deleted: {
      type: Boolean,
      default: false,
    },
    status: String,
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema, "orders");
export default Order;
