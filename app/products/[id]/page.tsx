// app/products/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiUser,
  FiStar,
} from "react-icons/fi";
import ProductViewTracker from "@/components/ProductViewTracker";
import { formatPrice } from "@/utils";
import { toast } from "react-hot-toast";
import { Category, Product } from "@/lib/generated/prisma";

type ProductWithOwner = Product & {
  owner?: {
    name: string;
    imageUrl?: string;
  };
  category?: Category;
};

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<ProductWithOwner | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productRes = await fetch(`/api/products/${params.id}`);

        if (!productRes.ok) {
          throw new Error("Failed to fetch product");
        }

        const productData = await productRes.json();
        setProduct(productData);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [params.id]);

  const handleAddToCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: params.id,
          quantity,
        }),
      });

      if (response.ok) {
        toast.success("Added to cart!");
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error("Error adding to cart:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-200 rounded-lg aspect-square"></div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
        <p className="mt-2 text-gray-600">
          The product you&quot;re looking for doesn&quot;t exist or may have
          been removed.
        </p>
      </div>
    );
  }
  console.log(product);

  return (
    <>
      <ProductViewTracker productId={params.id as string} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={product.imageUrl || ""}
                alt={product.title}
                width={800}
                height={600}
                className="object-cover"
                priority
              />
            </div>
            <div className="p-4 flex space-x-2 border-t border-gray-100">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <FiHeart className="text-gray-600" />
              </button>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <FiShare2 className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.title}
              </h1>
              <div className="flex items-center mt-2 space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`${
                        i < 4 ? "text-yellow-400" : "text-gray-300"
                      } w-5 h-5`}
                      fill={i < 4 ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(24 reviews)</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.stock > 0 ? (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  Out of Stock
                </span>
              )}
            </div>

            <p className="text-gray-700">{product.description}</p>

            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {product.owner && product.owner?.imageUrl ? (
                    <Image
                      src={product.owner?.imageUrl}
                      width={40}
                      height={40}
                      className="rounded-full"
                      alt={product.owner?.name}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <FiUser className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Sold by</p>
                  <p className="text-sm text-gray-500">{product.owner?.name}</p>
                </div>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.stock} available
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <FiShoppingCart className="mr-2" />
                  Add to Cart
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Category</h3>
              <p className="mt-1 text-sm text-gray-500">
                {product.category?.name || "Uncategorized"}
              </p>
            </div>
          </div>
        </div>

        {/* Product details section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Product Details
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Description
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {product.description}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Additional Information
                </h3>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Views:</span> {product.views}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Listed:</span>{" "}
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
