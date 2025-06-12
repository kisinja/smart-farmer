"use client";

import { FiChevronDown } from "react-icons/fi";
import { useEffect, useState } from "react";

const ProductFilters = () => {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [openCategory, setOpenCategory] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      console.log(data)
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      {/* Categories Filter */}
      <div>
        <button
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2"
          onClick={() => setOpenCategory(!openCategory)}
        >
          <span>Categories</span>
          <FiChevronDown
            className={`transition-transform ${
              openCategory ? "rotate-180" : ""
            }`}
          />
        </button>

        {openCategory && (
          <div className="space-y-2 pl-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-gray-700">{category.name}</span>
                </div>
                <span className="text-gray-500 text-sm">
                  {category.length}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div>
        <button
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-2"
          onClick={() => setOpenPrice(!openPrice)}
        >
          <span>Price Range</span>
          <FiChevronDown
            className={`transition-transform ${openPrice ? "rotate-180" : ""}`}
          />
        </button>

        {openPrice && (
          <div className="pl-2 space-y-4">
            <div className="flex justify-between text-sm text-gray-500">
              <span>KES {priceRange[0]}</span>
              <span>KES {priceRange[1]}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([parseInt(e.target.value), priceRange[1]])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Additional filters can be added here */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3">Farm Location</h3>
        <select className="w-full border rounded-lg px-3 py-2 text-sm">
          <option>All Locations</option>
          <option>Nairobi</option>
          <option>Nakuru</option>
          <option>Eldoret</option>
          <option>Mombasa</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;
