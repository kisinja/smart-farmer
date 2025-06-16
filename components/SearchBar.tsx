import React from "react";

const SearchBar = () => {
  return (
    <div className="relative w-max max-w-md group">
      <div className="flex items-center bg-white shadow-lg rounded-full transition-all duration-500 overflow-hidden group-hover:shadow-xl group-hover:bg-gray-100">
        <input
          type="text"
          placeholder="Search..."
          className="w-0 p-0 border-none opacity-0 transition-all duration-500 group-hover:w-64 group-hover:p-2 group-hover:opacity-100 group-hover:pl-3  focus:outline-none rounded-full"
        />
        <button className="p-1 border-3 border-gray-400 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-colors duration-500 shadow-md transform hover:scale-105 group-hover:border-orange-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
