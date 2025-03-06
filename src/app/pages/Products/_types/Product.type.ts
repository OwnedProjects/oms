export type CategoryType = {
  category_id: number;
  category_name: string;
  image_url: string;
  status: string;
};

export type ActiveCategoriesResponse = {
  code: number;
  status: string;
  categories: CategoryType[];
};

export type ProductType = {
  category_name: string;
  image_url: string;
  product_id: number;
  product_name: string;
  status: string;
  price: string;
  count?: number;
};

export type ActiveProductsResponse = {
  code: number;
  status: string;
  products: ProductType[];
};
