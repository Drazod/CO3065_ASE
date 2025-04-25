import React from "react";


const Register = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Logo */}
      <a href="/" className="w-1/2 bg-[#4A6FA5] items-center flex justify-center">
        <button className="flex items-center space-x-2 justify-center">
          <img
            src="/assets/hcmut-logo.svg"
            alt="Logo"
            className="h-20 mb-4"
          />
          <h1 className="text-4xl font-bold text-[#D6E5E3]">
            SCAMS
          </h1>
        </button>
      </a>


      {/* Right side - Form */}
      <div className="w-1/2 bg-[#E8F1F2] flex flex-col justify-center items-center px-20">
        <div className="w-full max-w-sm">
          <h2 className="text-4xl font-bold text-[#4A6FA5] mb-1">
            | <span className="text-[#1D1A05]">Hello new friend</span>
          </h2>
          <p className="text-LG text-gray-500 mb-6">
            Already have an account. <a href="/login" className="text-[#E09891]">Click here</a>
          </p>

          <input
            type="text"
            placeholder="Username/Email"
            className="w-full mb-4 px-4 py-3 rounded bg-gray-100 text-sm focus:outline-none"
          />

          <div className="relative mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded bg-gray-100 text-sm focus:outline-none"
            />
            <span className="absolute right-4 top-3.5 text-gray-400 cursor-pointer">
              👁️
            </span>
          </div>

          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Age"
              className="w-1/2 px-4 py-3 rounded bg-gray-100 text-sm focus:outline-none"
            />
            <div className="relative w-1/2">
              <input
                type="text"
                placeholder="Gender"
                className="w-full px-4 py-3 rounded bg-gray-100 text-sm focus:outline-none"
              />
              <span className="absolute right-3 top-3.5 text-gray-400">✔️</span>
            </div>
          </div>

          <button className="w-full py-3 rounded text-white font-semibold bg-gradient-to-r from-[#4A6FA5] to-[#D6E5E3] shadow-md">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
