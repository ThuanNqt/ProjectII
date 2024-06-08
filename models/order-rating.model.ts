import mongoose from "mongoose";

const orderRatingSchema = new mongoose.Schema(
  {
    user_id: String,
    order_id: String,
    products: {
      product_id: String,
      rating: Number,
      comment: String,
    },
  },
  {
    timestamps: true,
  }
);

const OrderRating = mongoose.model(
  "OrderRating",
  orderRatingSchema,
  "order-rating"
);
export default OrderRating;
