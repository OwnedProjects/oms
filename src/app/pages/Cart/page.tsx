"use client";
import { CONSTANTS } from "@/app/config/constants";
import { CartContext } from "@/app/context/CartContext";
import { useToast } from "@/app/context/ToastContext";
import { UserContext } from "@/app/context/UserContext";
import { Button, Image } from "@heroui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import CartDetails from "../CartDetails/page";

const Cart = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const router = useRouter();
  const context = useContext(CartContext);
  if (!context) throw new Error("CartContext must be used within CartProvider");
  const { state } = context;
  const usercontext = useContext(UserContext);
  if (!usercontext)
    throw new Error("UserContext must be used within UserProvider");
  const { state: userstate } = usercontext;
  const { successToast, errorToast } = useToast();

  const handleShopMore = () => {
    setIsDrawerOpen(false);
  };

  const handleCheckout = async () => {
    // console.log("Handle Checkout", userstate.user, state.cart);
    const response = await fetch(
      `${CONSTANTS.API_GATEWAY}/orders/createorder`,
      {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          cartItems: state.cart,
          userid: userstate.user.userid,
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
      setIsDrawerOpen(false);
    } else {
      errorToast({ title: "Something went wrong, please try again later" });
    }
  };
  return (
    <>
      {state?.cart?.length ? (
        <>
          <Button
            className={`fixed mr-2 bottom-5 z-50 animate-bounce hidden md:block pl-1 ${
              isDrawerOpen ? "right-1/4" : "right-5"
            }`}
            isIconOnly
            radius="sm"
            variant="solid"
            color="primary"
            onPress={() => setIsDrawerOpen(true)}
          >
            <Image src="/cart-white.svg" width={30} className="opacity-1" />
          </Button>

          {/* Overlay + Animated Card */}
          {isDrawerOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsDrawerOpen(false)} // Click anywhere to close
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: "0%" }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 120 }}
                className="fixed right-0 top-0 bg-white p-2 h-full w-1/4 shadow-lg border-l-2 border-blue-300 z-50"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the card
              >
                <CartDetails
                  handleShopMore={handleShopMore}
                  handleCheckout={handleCheckout}
                />
              </motion.div>
            </div>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Cart;
