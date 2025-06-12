"use client";
import myPrismaClient from "@/utils/connect";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiBox,
  FiShoppingCart,
  FiClock,
} from "react-icons/fi";

const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/user/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productId:string) => {
    if (!confirm("Delete this product permanently?")) return;
    try {
      const deleteRes = await myPrismaClient.product.delete({
        where: { id: productId },
      });
      if (deleteRes) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        alert("Product deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">My Products</h1>
            <p className="text-indigo-600">
              Manage your inventory and listings
            </p>
          </div>
          <Link
            href="/products/new"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg transition-colors shadow-sm"
          >
            <FiPlus size={18} />
            Add Product
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
              >
                {/* Product Image */}
                <div className="relative h-52 bg-indigo-50 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-200">
                      <FiBox size={48} />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                      {product.title}
                    </h3>
                    <span className="text-lg font-semibold text-indigo-600 whitespace-nowrap">
                      Ksh {product.price.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Inventory Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <FiShoppingCart className="text-indigo-400" />
                      <span>{product.stock} in stock</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="text-indigo-400" />
                      <span>
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  {product.category && (
                    <div className="mb-4">
                      <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                        {product.category.name}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 border-t pt-4">
                    <Link
                      href={`/products/${product.id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FiEye size={16} />
                      View
                    </Link>
                    <Link
                      href={`/products/edit/${product.id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium border transition-colors"
                    >
                      <FiEdit size={16} />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 py-2 px-3 rounded-lg text-sm font-medium border transition-colors"
                    >
                      <FiTrash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-300 mb-4">
              <FiBox size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products listed
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't created any products yet. Start selling by adding your
              first product.
            </p>
            <Link
              href="/products/new"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-sm transition-colors font-medium"
            >
              <FiPlus size={18} />
              Create First Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProductsPage;