import React from "react";
import products from "../../products.json";

const ProductCard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white shadow rounded-2xl p-4 flex flex-col items-center"
        >
          <img
            src={product.img}
            alt={product.title}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
          <h2 className="text-lg font-semibold text-center">{product.title}</h2>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
