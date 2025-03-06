"use client";
import { CartContext } from "@/app/context/CartContext";
import { Button, Card, CardBody, Divider, Image } from "@heroui/react";
import React, { useContext, useEffect, useState } from "react";

interface CartDetailsProps {
  handleShopMore: () => void;
  handleCheckout: () => void;
}

const CartDetails = ({ handleShopMore, handleCheckout }: CartDetailsProps) => {
  const [total, setTotal] = useState<string>("0");
  const context = useContext(CartContext);
  if (!context) throw new Error("CartContext must be used within CartProvider");
  const { state } = context;

  useEffect(() => {
    if (state.cart.length) {
      let sum = 0;
      state.cart.forEach((x) => (sum = sum + x.price * x.count));

      setTotal(sum.toFixed(2));
    }
  }, [state.cart]);

  return (
    <>
      <Card radius="none">
        <CardBody>
          <div className="text-xl my-3 mt-4 text-primary font-semibold">
            Your Cart
          </div>
          <Divider />
          <div className="my-4 grid grid-cols-4 gap-3">
            <div className="col-span-2 font-semibold underline">
              Product Name
            </div>
            <div className="font-semibold underline">Qty</div>
            <div className="font-semibold underline">Amount</div>

            {state?.cart?.map((item, index) => (
              <React.Fragment key={index}>
                <div className="col-span-2">
                  {item.product_name} (${item.price})
                </div>
                <div>{item.count}</div>
                <div>{parseFloat(item.count) * parseFloat(item.price)}</div>
              </React.Fragment>
            ))}

            <div className="col-span-3 font-semibold text-right">Total</div>
            <div className="text-primary">{total}</div>
          </div>
          <Button
            color="warning"
            variant="solid"
            radius="none"
            className="my-3"
            onPress={handleCheckout}
            endContent={
              <Image src="/cart.svg" className="opacity-1" width={20} />
            }
          >
            Checkout
          </Button>
          <Button
            color="danger"
            variant="light"
            radius="none"
            onPress={handleShopMore}
          >
            Shop More...
          </Button>
        </CardBody>
      </Card>
    </>
  );
};

export default CartDetails;
