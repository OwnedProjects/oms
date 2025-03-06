"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import Header from "@/app/components/Header";
import { useContext } from "react";
import { CartContext } from "@/app/context/CartContext";

const OrderConfirmation = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const cartContext = useContext(CartContext);
  if (!cartContext)
    throw new Error("CartContext must be used within CartProvider");
  const { state, dispatch } = cartContext;

  const cartItems = state.cart;
  const totalAmount = state.cart
    .reduce(
      (sum, item) => sum + parseFloat(item.price) * parseFloat(item.count),
      0
    )
    .toFixed(2);

  const handleNewOrder = () => {
    dispatch({ type: "RESET_CART" });
    router.push("/");
  };
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <Card className="w-full max-w-lg bg-white shadow-lg p-6 rounded-lg">
          {/* Success Message */}
          <h2 className="text-2xl font-bold text-green-600 text-center">
            🎉 Order Placed Successfully! 🎉
          </h2>
          <p className="text-gray-600 text-center mt-2">
            Your order <span className="font-bold">#{orderId}</span> has been
            placed. Thank you for shopping with us!
          </p>

          {/* Cart Details */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Order Summary:</h3>
            <ul className="mt-2 space-y-2">
              {cartItems.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between border-b pb-2 last:border-none"
                >
                  <span className="font-medium">
                    {item.product_name} (x{item.count})
                  </span>
                  <span>${(item.price * item.count).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${totalAmount}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-between">
            <Button
              variant="bordered"
              onPress={() => window.print()}
              radius="none"
            >
              🖨️ Print
            </Button>
            <Button onPress={handleNewOrder} radius="none">
              🛒 New Order
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default OrderConfirmation;
