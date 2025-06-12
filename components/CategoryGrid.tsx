import Link from "next/link";
import Image from "next/image";

const CategoryGrid = ({ categories }) => (
  <div className="bg-gradient-to-b from-indigo-50 to-white py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.map((category) => (
          <Link
            href={`/categories/${category.id}`}
            key={category.id}
            className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-2xl" />

            {/* Category image */}
            <div className="aspect-square overflow-hidden">
              <Image
                src={category.imageUrl}
                alt={category.name}
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Category name */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <h3 className="text-xl font-bold text-white text-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                {category.name}
              </h3>
              <h3 className="text-lg font-semibold text-white text-center group-hover:hidden absolute bottom-6 left-0 right-0 px-6">
                {category.name}
              </h3>
            </div>

            {/* Shop now button (hidden until hover) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <span className="bg-white text-indigo-700 font-medium px-6 py-2 rounded-full shadow-sm hover:bg-indigo-50 transition-colors">
                Shop Now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default CategoryGrid;