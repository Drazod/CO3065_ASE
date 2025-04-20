import React, { useState } from "react";
import { Helmet } from 'react-helmet';
import Footer from "../components/footer";

import "react-datepicker/dist/react-datepicker.css";
import "../App.css";

const Welcome = () => {

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Fresh Vegan Chocolate Chip Cookie Dough | Yumeow-Cookie</title>
        <meta
          name="description"
          content="Enjoy the best vegan chocolate chip cookie dough at Yumeow-Cookie. Order now for freshly baked vegan cookies!"
        />
      </Helmet>

      <div className="h-screen w-screen flex flex-col text-[#0c0f3f] bg-[url('./assets/welcomepage/background.jpg')] bg-cover bg-opacity-10 bg-no-repeat bg-center relative ">
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-6 z-20">
          <h1 className="text-2xl font-light tracking-widest">
            <span className="font-bold text-[#132565]">HCMUT</span> ROOM BOOKING
          </h1>
          <nav className="space-x-8 font-semibold text-xl mr-2">
            <a href="#" className="">ABOUT</a>
            <a href="#" className="">LOG IN</a>
            <a href="#" className="">CONTACT</a>
          </nav>
        </header>

        <div className="relative z-10 flex justify-end items-center h-full px-0 ">
          <div className="w-full h-full md:w-2/5 flex flex-col justify-center items-start px-6 bg-[white]/60 backdrop-blur-xs">
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4"><span className="block leading-[1]">HCMUT</span><span className="block leading-[1] mt-4">ROOM BOOKING</span></h2>
            <p className="text-lg md:text-xl mb-6">
            Room Management Service (ROMS)<br /> of the university 
            </p>
            <hr className="border-t-4 border-black w-80 mb-6" />
            <p className="text-sm tracking-widest">SINCE 2025</p>

            {/* Carousel Buttons */}
            <div className="flex z-30 space-x-2 mt-8">
              <a href="/store">
                  <button
                    className="p-2 text-white bg-blue-800 hover:bg-[#1e2e6a] font-bold text-base w-full h-full z-10"
                    style={{ fontFamily: "'Josefin Sans', serif" }}
                  >
                    BOOK NOW
                  </button>
                </a>
            </div>
          </div>
        </div>
      </div>


      <Footer />
    </>
  );
};

export default Welcome;
