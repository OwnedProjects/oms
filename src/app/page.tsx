"use client";
import { useState } from "react";
import Header from "./components/Header";
import Cart from "./pages/Cart/page";
import InventoryCategories from "./pages/Inventory/page";
import ProductsList from "./pages/Products/page";

const App = () => {
  const [selCategory, setSelCategory] = useState<string | number>("all");

  return (
    <>
      <Header />

      <div className="grid grid-cols-7 gap-4">
        <InventoryCategories setSelCategory={setSelCategory} />
        <ProductsList selCategory={selCategory} />
      </div>

      <Cart />
    </>
  );
};

export default App;
