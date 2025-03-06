import React, { useEffect, useState } from "react";
import Product from "./_widgets/Product";
import { CONSTANTS } from "@/app/config/constants";
import { ActiveProductsResponse, ProductType } from "./_types/Product.type";

interface ProductsListProps {
  selCategory: string | number;
}

const ProductsList = ({ selCategory }: ProductsListProps) => {
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  useEffect(() => {
    let query = "";
    if (selCategory === "all") {
      query = `${CONSTANTS.API_GATEWAY}/inventory/getproductsbycategory`;
    } else {
      query = `${CONSTANTS.API_GATEWAY}/inventory/getproductsbycategory?categoryid=${selCategory}`;
    }

    fetchProducts(query);
  }, [selCategory]);

  const fetchProducts = async (query: string) => {
    setAllProducts([]);
    const response = await fetch(query);
    const result: ActiveProductsResponse = await response.json();
    // console.log(result);
    setAllProducts(result?.products || []);
  };

  return (
    <div className="md:col-span-6 col-span-7 p-2">
      <div className="gap-8 grid grid-cols-1 sm:grid-cols-3">
        {allProducts.map((item, index) => (
          <React.Fragment key={index}>
            <Product item={item} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
