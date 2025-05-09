import React, { useState, useEffect } from "react";
import "../index.css";
import { FaUserCircle, FaShoppingCart, FaGift } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
// import CartModal from "../layouts/cart";

export default function Header() {
  // const [showCart, setShowCart] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full text-[#E8F1F2] bg-[#4A6FA5] grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} items-center text-[22px] px-6 py-6 border-b border-[#434237] z-20 font-Jsans`}>
      <div className="flex items-center space-x-6">
        <a href="/">
          <button className=" text-[#1D1A05] rounded-full py-2 px-4 bg-[#E8F1F2] hover:bg-[#D6E5E3] transition-colors duration-300 z-20">
            home
          </button>
        </a>
      </div>

      {!isMobile && (
        <div className="flex justify-center">
          <a href="/">
            <h1 className="text-[33px] font-dancing font-semibold mr-6">
              SCAMS
            </h1>
          </a>
        </div>
      )}

      <div className="flex items-center font-light justify-end space-x-6 relative">
        <a href="/home#contact" className="hover:text-gray-600">
          about
        </a>
        <a href="/home#contact" className="hover:text-gray-600">
          contact 
        </a>
        
        {/* <a href={memberData ? "/profile" : "/login"} className="flex items-center space-x-2"> */}
        {user ? (
          <>
            <a href="/profile" className="flex items-center space-x-2 hover:text-gray-600">
              <div className="flex items-center space-x-2">
                <FaUserCircle className="text-xl hover:text-gray-600" />
                <span className="text-base font-medium">{user.username}</span>
              </div>
            </a>
            <button
              onClick={logout}
              className="text-sm bg-[#E8F1F2] text-[#1D1A05] px-3 py-1 rounded hover:bg-[#D6E5E3] transition"
            >
              Log Out
            </button>
          </>
        ) : (
          <a
            href="/login"
            className="flex items-center space-x-2"
          >
            <div className="flex items-center space-x-2">
              <FaUserCircle className="text-xl hover:text-gray-600" />
              <span className="text-base font-medium">Login</span>
            </div>
          </a>
        )}


        {/* <FaShoppingCart onClick={() => setShowCart(true)} className="text-xl hover:text-gray-600" />
        <CartModal showCart={showCart} setShowCart={setShowCart} /> */}
        {/* <FaShoppingCart className="text-xl hover:text-gray-600" /> */}
      </div>

      {isMobile && (
        <div className="flex justify-center mt-4">
          <a href="/">
            <h1 className="text-[30px] font-dancing font-semibold">
              HRB
            </h1>
          </a>
        </div>
      )}
    </header>
  );
}
