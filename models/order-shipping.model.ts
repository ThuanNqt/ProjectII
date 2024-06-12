import mongoose from "mongoose";

const orderShippingSchema = new mongoose.Schema(
  {
    order_id: String,
    shipName: String,
    shipPhone: String,
  },
  {
    timestamps: true,
  }
);

const OrderShipping = mongoose.model(
  "OrderShipping",
  orderShippingSchema,
  "order-shipping"
);
export default OrderShipping;
