import React from 'react';
import { Link } from 'react-router-dom';

const PageNot = () => {
  return (
    <div className="flex flex-col  items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="text-center px-4 py-8 rounded-2xl backdrop-blur-sm bg-white/80 shadow-xl border border-white/20 max-w-2xl mx-4">
        <div className="relative mt-28">
          <h1 className="text-8xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent animate-pulse">
            4<span className="inline-block animate-bounce text-blue-200">0</span>4
          </h1>
          <div className="absolute -top-6 -right-6 transform rotate-12">
            <span className="text-6xl">🐾</span>
          </div>
        </div>
        
        <p className="text-3xl font-bold mt-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Ruh Roh! Page Not Found
        </p>
        <p className="text-gray-600 mt-4 text-lg">
          Looks like this bone is buried somewhere else!
        </p>
        
        <div className="mt-8 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <img
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmQ0OTBmMzM0ZDFmZWE4MzFhYzQ5NGJiYjQ5MmM1OGM5ZmY3ZmNhNyZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/mCRJDo24UvJMA/giphy.gif"
            alt="Cute dog digging animation"
            className="relative rounded-lg mx-auto w-full max-w-md object-cover"
          />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
              🏠
            </span>
            Take Me Home
          </Link>
        </div>
        
        <div className="mt-6 flex justify-center space-x-4">
          <span className="animate-bounce text-3xl">🐕</span>
          <span className="animate-bounce delay-100 text-3xl">🦮</span>
          <span className="animate-bounce delay-200 text-3xl">🐩</span>
        </div>
      </div>
    </div>
  );
};

export default PageNot;
