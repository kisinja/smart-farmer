import React from "react";

const BlogCardSkeleton = () => {
    return (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                {/* Image placeholder */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-200 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                </div>

                <div className="p-4">
                    {/* Title placeholder */}
                    <div className="mb-3 h-6 w-3/4 rounded bg-gray-200 animate-pulse"></div>

                    {/* Content placeholder */}
                    <div className="mb-2 h-4 w-full rounded bg-gray-200 animate-pulse"></div>
                    <div className="mb-4 h-4 w-5/6 rounded bg-gray-200 animate-pulse"></div>

                    {/* Author and date placeholder */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
                        </div>
                        <div className="h-3 w-16 rounded bg-gray-200 animate-pulse"></div>
                    </div>
                </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                {/* Image placeholder */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-200 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                </div>

                <div className="p-4">
                    {/* Title placeholder */}
                    <div className="mb-3 h-6 w-3/4 rounded bg-gray-200 animate-pulse"></div>

                    {/* Content placeholder */}
                    <div className="mb-2 h-4 w-full rounded bg-gray-200 animate-pulse"></div>
                    <div className="mb-4 h-4 w-5/6 rounded bg-gray-200 animate-pulse"></div>

                    {/* Author and date placeholder */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
                        </div>
                        <div className="h-3 w-16 rounded bg-gray-200 animate-pulse"></div>
                    </div>
                </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
                {/* Image placeholder */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-200 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
                </div>

                <div className="p-4">
                    {/* Title placeholder */}
                    <div className="mb-3 h-6 w-3/4 rounded bg-gray-200 animate-pulse"></div>

                    {/* Content placeholder */}
                    <div className="mb-2 h-4 w-full rounded bg-gray-200 animate-pulse"></div>
                    <div className="mb-4 h-4 w-5/6 rounded bg-gray-200 animate-pulse"></div>

                    {/* Author and date placeholder */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse"></div>
                        </div>
                        <div className="h-3 w-16 rounded bg-gray-200 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCardSkeleton;