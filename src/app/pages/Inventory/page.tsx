import { Button, Image } from "@heroui/react";

import { CONSTANTS } from "@/app/config/constants";
import { UserContext } from "@/app/context/UserContext";
import { useContext, useEffect, useState } from "react";
import {
  ActiveCategoriesResponse,
  CategoryType,
} from "../Products/_types/Product.type";

interface InventoryCategoriesProps {
  setSelCategory: (cat: string | number) => void;
}
const InventoryCategories = ({ setSelCategory }: InventoryCategoriesProps) => {
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const context = useContext(UserContext);
  if (!context) throw new Error("UserContext must be used within UserProvider");
  const { state, dispatch } = context;

  useEffect(() => {
    fetchActiveCategories();
    generateUserId();
  }, []);

  const generateUserId = () => {
    console.log("User", state.user);
    if (!state.user.userid) {
      const newUserId = `T-${new Date().getTime()}`;
      dispatch({ type: "GENERATE_USER", payload: newUserId });
    }
  };

  const fetchActiveCategories = async () => {
    const response = await fetch(
      `${CONSTANTS.API_GATEWAY}/inventory/getactivecategories`
    );
    const result: ActiveCategoriesResponse = await response.json();
    setAllCategories(result?.categories || []);
  };

  const handleCategorySelection = (category: CategoryType | "all") => {
    if (category === "all") {
      setSelectedCategory(category);
      setSelCategory(category);
    } else {
      setSelectedCategory(category.category_name);
      setSelCategory(category.category_id);
    }
  };

  return (
    <div className="md:col-span-1 col-span-7 p-2">
      <Button
        variant="flat"
        color={`${selectedCategory === "all" ? "primary" : "default"}`}
        radius="none"
        className="my-2"
        fullWidth
        onPress={() => handleCategorySelection("all")}
        startContent={
          <Image
            src={`${CONSTANTS.API_GATEWAY}/files/category_home.svg`}
            alt="test"
            className="opacity-1"
            width={20}
          />
        }
      >
        Home
      </Button>

      {allCategories?.map((category) => (
        <Button
          key={category.category_id}
          variant="flat"
          radius="none"
          className="my-2"
          fullWidth
          color={`${
            selectedCategory === category.category_name ? "primary" : "default"
          }`}
          onPress={() => handleCategorySelection(category)}
          startContent={
            <Image
              src={`${CONSTANTS.API_GATEWAY}${category.image_url}`}
              alt="test"
              className="opacity-1"
              width={20}
            />
          }
        >
          {category.category_name}
        </Button>
      ))}
    </div>
  );
};

export default InventoryCategories;
