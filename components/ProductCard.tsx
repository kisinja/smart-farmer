"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/generated/prisma";
import { formatPrice } from "@/utils";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProductCard = ({ product, owner }: { product: Product; owner: any }) => {
  const ownerId = product.ownerId;

  const { getUser } = useKindeBrowserClient();
  const user = getUser();

  const [isHovered, setIsHovered] = useState(false);

  const { dispatch } = useCart();

  const isOwner = user?.id === ownerId;

  const addToCart = async (product: Product) => {
    try {
      // Add product to backend cart
      const res = await fetch("/api/user/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      // Get updated cart
      const updatedCart = await fetch("/api/user/cart");
      const data = await updatedCart.json();

      const items =
        data.cart?.[0]?.cartItems.map(
          ({ product, quantity }: { product: Product; quantity: number }) => ({
            ...product,
            quantity,
          })
        ) || [];

      dispatch({ type: "SET_CART", items });
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  return (
    <div
      className="relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-indigo-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-60 overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
        </Link>
        <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-md">
          {formatPrice(product.price)}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-indigo-900 mb-2 line-clamp-1">
          {product.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {owner && (
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-10 h-10 relative rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-indigo-200">
                {owner.picture ? (
                  <Image
                    src={owner.picture}
                    alt={owner.first_name}
                    fill
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-indigo-600 font-medium">
                    {owner.first_name?.charAt(0)}
                    {owner.last_name?.charAt(0)}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isOwner ? "You" : `${owner.first_name} ${owner.last_name}`}
              </p>
              <p className="text-xs text-gray-500">Verified Seller</p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-all duration-300 font-medium flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => addToCart(product)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            Add to Cart
          </button>
          <button className="flex-1 bg-white hover:bg-indigo-50 text-indigo-600 py-2 px-4 rounded-lg transition-all duration-300 font-medium border border-indigo-200 flex items-center justify-center gap-2 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            Quick View
          </button>
        </div>
      </div>

      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent pointer-events-none"></div>
      )}
    </div>
  );
};

export default ProductCard;
