"use client";
import React, { useEffect, useState } from "react";
import { Order } from "../kitchen-display/_types/kitchen.types";
import io from "socket.io-client";
import { CONSTANTS } from "@/app/config/constants";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { useToast } from "@/app/context/ToastContext";

const DisplayOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { successToast, errorToast } = useToast();
  const [selOrder, setSelOrder] = useState<Order | null>(null);

  // ✅ UseEffect to handle WebSockets safely
  useEffect(() => {
    const socket = io(CONSTANTS.API_SOCKET_URL);

    // Listen for new "done" orders
    socket.on("doneOrders", (doneOrders: Order) => {
      console.log("Received Order via WebSocket:", doneOrders);
      setOrders((prevOrders) => [...prevOrders, doneOrders]);
    });

    return () => {
      socket.off("doneOrders");
      socket.disconnect(); // ✅ Prevents memory leaks
    };
  }, []);

  const fetchDoneOrders = async () => {
    try {
      const res = await fetch(`${CONSTANTS.API_GATEWAY}/orders/doneorders`);
      const data = await res.json();
      console.log("Fetched Orders:", data);
      setOrders(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch done orders:", error);
    }
  };

  useEffect(() => {
    fetchDoneOrders();
  }, []);

  const handleOpenModal = (order: Order) => {
    onOpen();
    setSelOrder(order);
  };

  // ✅ Improved order closing logic
  const handleClosingOrder = async () => {
    if (!selOrder) return;

    try {
      const response = await fetch(
        `${CONSTANTS.API_GATEWAY}/orders/${selOrder.order_id}/close`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to close order");
      }

      onClose();
      successToast({ title: "Order Closed Successfully" });

      // ✅ Remove closed order from UI
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.order_id !== selOrder.order_id)
      );
    } catch (error) {
      errorToast({ title: "Something went wrong, please try again later" });
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-4 px-2 py-1 mt-2">
        {isLoading ? (
          <div className="col-span-4 text-center">
            <Spinner label="Please wait ..." />
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <Card
              className="bg-red-50 border-2 border-slate py-5"
              radius="none"
              isPressable
              key={order.order_id} // ✅ Correct key usage
              onPress={() => handleOpenModal(order)}
            >
              <CardBody className="text-center">
                <p className="text-primary text-2xl">
                  ORDER: # <strong>{order.order_no || "N/A"}</strong>
                </p>
              </CardBody>
            </Card>
          ))
        ) : (
          <p className="col-span-4 text-center">No pending orders</p>
        )}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                Are you sure to mark{" "}
                <span className="text-primary">
                  Order # {selOrder?.order_no}
                </span>{" "}
                as CLOSE?
              </ModalHeader>
              <ModalBody className="grid grid-cols-3 gap-4 py-5 my-3">
                <Button
                  variant="ghost"
                  color="secondary"
                  size="lg"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  size="lg"
                  className="col-span-2"
                  onPress={handleClosingOrder}
                >
                  Close Order
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DisplayOrders;
