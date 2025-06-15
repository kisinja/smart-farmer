import ProductFilters from "@/components/ProductFilters";
import ProductCard from "@/components/ProductCard";
import { FiFilter, FiGrid, FiList, FiPackage } from "react-icons/fi";
import myPrismaClient from "@/utils/connect";
import { getUser } from "@/utils/kinde/getUser";
import { redirect } from "next/navigation";

const ProductsPage = async () => {
  const products = await myPrismaClient.product.findMany({
    include: {
      category: true,
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="bg-indigo-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Smart Farmer Marketplace</h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
            Discover the freshest products directly from local farmers
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                <button className="md:hidden text-indigo-600">
                  <FiFilter className="w-5 h-5" />
                </button>
              </div>
              <ProductFilters />
              {/* You may remove this button or keep it as a dummy */}
              <button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  All Products
                </h2>
                <p className="text-gray-600">
                  {products.length} products available
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button className="p-2 bg-indigo-100 text-indigo-600">
                    <FiGrid className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:bg-gray-100">
                    <FiList className="w-5 h-5" />
                  </button>
                </div>
                <select className="border rounded-lg px-3 py-2 text-sm">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                  <option>Best Selling</option>
                </select>
              </div>
            </div>

            {/* Products List */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {await Promise.all(
                  products.map(async (product) => {
                    const owner = await getUser(product.ownerId);
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        owner={owner}
                      />
                    );
                  })
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-400 mb-4">
                  <FiPackage className="text-3xl" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products found
                  </h3>
                </div>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 rounded bg-indigo-600 text-white">
                  1
                </button>
                <button className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <span className="px-2">...</span>
                <button className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-50">
                  8
                </button>
                <button className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
