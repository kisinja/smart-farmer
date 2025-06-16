import CategoryGrid from "@/components/CategoryGrid";
import myPrismaClient from "@/utils/connect";
import Link from "next/link";
import React from "react";
import { FiArrowRight } from "react-icons/fi";

const HomePage = async () => {
  const categories = await myPrismaClient.category.findMany({
    orderBy: { name: "asc" },
    include: {
      products: {
        take: 1, // Get one product for thumbnail
        select: {
          imageUrl: true
        }
      }
    }
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <section className="relative h-96 w-full overflow-hidden bg-indigo-900">
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Discover Fresh Farm Products
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Direct from local farmers to your table
            </p>
            <Link 
              href="#categories" 
              className="inline-flex items-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-full font-medium transition-colors"
            >
              Browse Categories <FiArrowRight className="mt-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section id="categories" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-900 ">
              Shop by Category
            </h2>
            <p className="text-lg text-indigo-600 max-w-2xl mx-auto">
              Explore our wide range of fresh farm products
            </p>
          </div>

          <div className="mb-16">
            <CategoryGrid categories={categories} />
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-xl shadow-md p-8 sm:p-10 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Can&quot;t find what you&quot;re looking for?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our farmers add new products daily. Check back soon or contact us for special requests.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/products" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                View All Products
              </Link>
              <Link 
                href="/contact" 
                className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border transition-colors"
              >
                Contact Farmers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial/Stats Section */}
      <section className="bg-indigo-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <h3 className="text-4xl font-bold mb-2">100+</h3>
              <p className="text-indigo-200">Local Farmers</p>
            </div>
            <div className="p-6">
              <h3 className="text-4xl font-bold mb-2">500+</h3>
              <p className="text-indigo-200">Fresh Products</p>
            </div>
            <div className="p-6">
              <h3 className="text-4xl font-bold mb-2">10K+</h3>
              <p className="text-indigo-200">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;