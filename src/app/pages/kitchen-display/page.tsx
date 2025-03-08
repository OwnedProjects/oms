"use client";

import Header from "@/app/components/Header";
import { CONSTANTS } from "@/app/config/constants";
import { Spinner } from "@heroui/react";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Order } from "./_types/kitchen.types";
import KitchenOrder from "./_widgets/kitchen-order";

// Connect to WebSocket server
const socket = io(CONSTANTS.API_SOCKET_URL);

const KitchenDisplay = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch pending orders on component mount
  useEffect(() => {
    fetchPendingOrders();

    // Listen for new orders via WebSockets
    socket.on("newOrder", (newOrder: Order) => {
      setOrders((prevOrders) => [...prevOrders, newOrder]);
    });

    return () => {
      socket.off("newOrder");
    };
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const res = await fetch(`${CONSTANTS.API_GATEWAY}/orders/pendingorders`);
      const data = await res.json();
      console.log("=====> ", data);
      setOrders(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch pending orders:", error);
    }
  };

  const refetchPendingOrders = () => {
    setIsLoading(true);
    fetchPendingOrders();
  };
  return (
    <>
      <Header />
      <div className="grid grid-cols-4 gap-4 px-2 py-1 mt-2">
        {isLoading ? (
          <>
            <div className="col-span-4 text-center">
              <Spinner label="Please wait ..." />
            </div>
          </>
        ) : (
          <>
            {orders.length > 0 ? (
              orders.map((order) => (
                <React.Fragment key={order.order_id}>
                  <KitchenOrder order={order} handleCB={refetchPendingOrders} />
                </React.Fragment>
              ))
            ) : (
              <p className="col-span-4 my-1 text-center text-red-500 text-xl">
                Sorry to see No Pending Orders, We like to keep you fed 😊
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default KitchenDisplay;
