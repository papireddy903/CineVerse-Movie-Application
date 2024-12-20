import React from 'react';

const SearchBar = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search for something..."
          className="w-full p-4 pl-10 text-white bg-gray-700 rounded-full outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 shadow-lg placeholder-gray-400"
        />
        <div className="absolute left-4 top-4 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M9.5 17a7.5 7.5 0 1 1 5.306-12.806A7.5 7.5 0 0 1 9.5 17z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
