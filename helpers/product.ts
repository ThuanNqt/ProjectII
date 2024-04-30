interface IProduct {
  title: String;
  product_category_id: string;
  description: String;
  price: Number;
  newPrice?: number;
  discountPercentage: Number;
  stock: Number;
  thumbnail: String;
  status: String;
  featured: String;
  position: Number;
  deleted: boolean;
  deletedAt: Date;
  slug: string;
}

export const priceNewProducts = (products) => {
  const newProducts: IProduct[] = products.map((product) => {
    product.newPrice = (
      (product.price * (100 - product.discountPercentage)) /
      100
    ).toFixed(0);
    return product;
  });
  return newProducts;
};
