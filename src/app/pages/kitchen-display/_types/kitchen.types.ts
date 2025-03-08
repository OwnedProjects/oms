export interface CartItems {
  product_id: number;
  quantity: string;
  price: string;
  product_name: string;
}
export interface Order {
  order_id: number;
  order_no: number;
  order_date: string;
  order_total: number;
  cartItems: CartItems[];
}
