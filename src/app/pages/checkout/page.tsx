"use client";
import { CONSTANTS } from "@/app/config/constants";
import CartDetails from "../CartDetails/page";
import { useContext } from "react";
import { CartContext } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartContext must be used within CartProvider");
  const { state } = context;
  const { successToast, errorToast } = useToast();
  const router = useRouter();

  const handleShopMore = () => {
    console.log("Handle Shop More in Web View");
    router.push("/");
  };
  const handleCheckout = async () => {
    const response = await fetch(
      `${CONSTANTS.API_GATEWAY}/orders/createorder`,
      {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          cartItems: state.cart,
        }),
      }
    );
    const result = await response.json();
    // console.log("RESULT", result.order_no);
    if (response.ok) {
      successToast({
        title: "Order Created Successfully",
        onClose() {
          router.push(`pages/order-confirmation?orderId=${result?.order_no}`);
        },
      });
    } else {
      errorToast({ title: "Something went wrong, please try again later" });
    }
  };
  return (
    <>
      <CartDetails
        handleShopMore={handleShopMore}
        handleCheckout={handleCheckout}
      />
    </>
  );
};

export default Checkout;
