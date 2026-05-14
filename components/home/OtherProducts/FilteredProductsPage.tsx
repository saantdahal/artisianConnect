"use client";

import { useState } from "react";
import { mockProducts, mockCategories } from "@/lib/data/mockData";
// import Categories from "@components/home/Categories";
// import ProductCard from "./ProductCard";
import Categories from "../Categories/Categories";
import ProductCard from "../FeatureProducts/ProductCard";

const FilteredProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(mockCategories[0].id);

  const filteredProducts = mockProducts.filter(
    (p) => p.categoryIndex === selectedCategory
  );

  return (
    <div className="flex gap-10 p-6">
      {/* LEFT SIDE: CATEGORIES */}
      <Categories />

      {/* RIGHT SIDE: PRODUCTS */}
      <div className="grid grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        <Categories />
      </div>
    </div>
  );
};

export default FilteredProductsPage;
