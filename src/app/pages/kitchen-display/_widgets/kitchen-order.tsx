import { CONSTANTS } from "@/app/config/constants";
import { useToast } from "@/app/context/ToastContext";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import React from "react";
import { Order } from "../_types/kitchen.types";

interface KitchenOrderProps {
  order: Order;
  handleCB?: () => void;
}

const KitchenOrder = ({ order, handleCB }: KitchenOrderProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { successToast, errorToast } = useToast();

  const handleClosingOrder = async () => {
    const response = await fetch(
      `${CONSTANTS.API_GATEWAY}/orders/${order.order_id}/done`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // Even an empty body may be required
      }
    );
    const result = await response.json();
    onClose();
    if (response.ok) {
      successToast({
        title: "Order Marked as Done Successfully",
        onClose() {
          handleCB?.();
        },
      });
    } else {
      errorToast({ title: "Something went wrong, please try again later" });
    }
  };

  return (
    <>
      <Card
        className="bg-sky-50 border-1 border-slate"
        radius="none"
        isPressable
        onPress={onOpen}
      >
        <CardBody className="text-left">
          <p className="text-primary text-lg">
            ORDER: # <strong>{order.order_no}</strong>
          </p>

          <div className="grid grid-cols-4 gap-2 py-1 mt-1">
            {order.cartItems.map((cart, index) => (
              <React.Fragment key={`${cart.product_id}_${index}`}>
                <div className="col-span-3 my-1">
                  <p>{cart.product_name}</p>
                </div>
                <div className="text-center">{cart.quantity}</div>
              </React.Fragment>
            ))}
          </div>
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        backdrop="opaque"
        radius="none"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-start gap-1">
                Are you sure to mark
                <span className="text-primary">
                  {" "}
                  Order # {order.order_no}
                </span>{" "}
                as DONE?
              </ModalHeader>
              <ModalBody className="grid grid-cols-3 gap-4 py-5 my-3">
                <Button
                  variant="ghost"
                  color="secondary"
                  size="lg"
                  radius="none"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  size="lg"
                  radius="none"
                  className="col-span-2"
                  onPress={handleClosingOrder}
                >
                  Mark as Done
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default KitchenOrder;
