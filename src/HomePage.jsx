import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-10 bg-white shadow-lg rounded-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome!</h1>
        <p className="text-gray-600 mb-8">
          Join our platform by logging in or signing up to get started.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => handleNavigate("/login")}
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
          <button
            onClick={() => handleNavigate("/signup")}
            className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
