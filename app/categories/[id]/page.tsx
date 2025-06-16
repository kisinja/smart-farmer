import ProductCard from "@/components/ProductCard";
import { ParamsProps } from "@/types";
import myPrismaClient from "@/utils/connect";
import { getUser } from "@/utils/kinde/getUser";
import Image from "next/image";
import React from "react";

const CategoryPage = async ({ params }: { params: ParamsProps }) => {
  const categoryId = (await params).id;

  const category = await myPrismaClient.category.findMany({
    where: { id: categoryId },
    include: {
      products: true,
    },
  });

  if (!category || category.length === 0) {
    return <div className="text-center py-12">Category not found</div>;
  }

  const { name, description, imageUrl, products } = category[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Category Hero Section */}
      <div className="relative h-64 w-full overflow-hidden bg-indigo-900">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="100vw"
            className="w-full h-full object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-indigo-900/30">
          <div className="text-center px-4">
            <h1 className="text-4xl font-bold text-white mb-2">{name}</h1>
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-indigo-800 mb-8">
          Products in this category
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(async product => {
              const owner = await getUser(product.ownerId);
              return (
                <ProductCard key={product.id} product={product} owner={owner} />
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-indigo-700">
            No products available in this category yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
