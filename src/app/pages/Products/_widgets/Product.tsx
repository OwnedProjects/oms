import { Button, Card, CardBody, CardFooter, Image } from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import { ProductType } from "../_types/Product.type";
import { CartContext } from "@/app/context/CartContext";

interface ProductProps {
  item: ProductType;
}

const Product = ({ item }: ProductProps) => {
  const [count, setCount] = useState(0);
  const context = useContext(CartContext);
  if (!context) throw new Error("CartContext must be used within CartProvider");
  const { state, dispatch } = context;

  useEffect(() => {
    const tmpItem = state?.cart?.filter(
      (cartItem) => cartItem.product_id === item.product_id
    );
    const tmpCount = tmpItem?.length ? tmpItem?.[0].count : 0;
    setCount(tmpCount);
  }, [item]);

  const handleRemoveItem = (evt: React.MouseEvent) => {
    if (count - 1 !== 0) {
      setCount(count - 1);
      item.count = count - 1;
      dispatch({ type: "ADD_TO_CART", payload: item });
    } else {
      setCount(count - 1);
      const index = state.cart.findIndex(
        (x) => x.product_id === item.product_id
      );
      console.log("INDEX", index);
      dispatch({ type: "REMOVE_CART", index });
    }
  };

  const handleAddItem = () => {
    setCount(count + 1);
    item.count = count + 1;
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  return (
    <Card shadow="sm" radius="none">
      {/* Product Image */}
      <CardBody className="overflow-visible bg-default-200 p-0">
        <Image
          alt={item.product_name}
          className="w-full object-cover h-[140px]"
          radius="lg"
          shadow="sm"
          src={item.image_url}
          width="100%"
        />
      </CardBody>

      {/* Footer with Product Name & Buttons */}
      <CardFooter className="text-small p-2 flex flex-col md:flex-row items-center md:justify-between gap-2">
        {/* Product Name with Truncate */}
        <strong
          className="mt-0 w-full text-center md:text-left truncate"
          title={item.product_name}
        >
          {item.product_name}
        </strong>
        <div className="italic"> ${item.price}</div>
        {/* Add / Remove Buttons */}
        {count <= 0 ? (
          <Button
            size="sm"
            variant="ghost"
            color="primary"
            radius="full"
            className="whitespace-nowrap px-5"
            title="Add to Cart"
            onPress={handleAddItem}
          >
            Add To Cart
          </Button>
        ) : (
          <div className="flex items-center border-2 border-blue-200 rounded-full px-2 whitespace-nowrap">
            <Image
              alt="Remove Item"
              title="Remove Item"
              className="cursor-pointer opacity-1"
              radius="lg"
              shadow="sm"
              src="/trash-red.svg"
              width={50}
              onClick={handleRemoveItem}
            />
            <span className="font-semibold text-base px-4 cursor-default">
              {count}
            </span>
            <Image
              alt="Add Item"
              title="Add Item"
              className="cursor-pointer opacity-1"
              radius="lg"
              shadow="sm"
              src="/plus.svg"
              width={50}
              onClick={handleAddItem}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default Product;
