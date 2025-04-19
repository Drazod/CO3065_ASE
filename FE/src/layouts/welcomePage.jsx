import React, { useState } from "react";
import { Helmet } from 'react-helmet';
import Footer from "../components/footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";

const Welcome = () => {
  const [filters, setFilters] = useState({ time: '', type: '', status: '' });
  const [selectedDate, setSelectedDate] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
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

      <div className="h-screen w-screen flex flex-col  bg-[url('./assets/welcomepage/background.jpg')] bg-cover bg-no-repeat bg-center relative ">
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-6 z-20">
          <h1 className="text-2xl font-light tracking-widest">
            <span className="font-bold">HCMUT</span> ROOM BOOKING
          </h1>
          <nav className="space-x-8">
            <a href="#" className="hover:underline">ABOUT</a>
            <a href="#" className="hover:underline">LOG IN</a>
            <a href="#" className="hover:underline">CONTACT</a>
          </nav>
        </header>

        <div className="relative z-10 flex justify-end items-center h-full px-0 ">
          <div className="w-full h-full md:w-1/3 flex flex-col justify-center items-start pl-10 bg-white/60 backdrop-blur-xs">
            <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-4">
              HCMUT<br />ROOM BOOKING
            </h2>
            <p className="text-lg md:text-xl mb-6">
            Room Management Service (ROMS)<br /> of the university 
            </p>
            <hr className="border-t-4 border-black w-80 mb-6" />
            <p className="text-sm tracking-widest">SINCE 2025</p>

            {/* Carousel Buttons */}
            <div className="flex space-x-2 mt-8">
              <a href="/store">
                <button className="p-2 bg-black bg-opacity-60 hover:bg-opacity-40 ">
                  <span className="text-xl text-white">Learn more</span>
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Room Booking Filter + List */}
            {/* Room Booking Filter + List */}
      <section className="py-16 px-8 bg-gray-100 text-gray-800">
        <div className="max-w-5xl mx-auto bg-blue-50 p-8 rounded-2xl shadow-md">
          <h2 className="text-3xl font-semibold text-center mb-1">Book a Room</h2>
          <p className="text-center text-gray-600 mb-8">Discover the perfect space for you!</p>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="flex flex-col items-start w-full md:w-auto">
              <label className="text-sm font-medium mb-1">Date</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="Check Available"
                dateFormat="dd/MM/yyyy"
                className="w-full md:w-48 border px-4 py-2 rounded bg-white shadow-sm"
              />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <div className="flex flex-col items-start">
                <label className="text-sm font-medium mb-1">Adults</label>
                <select className="px-4 py-2 border rounded w-full">
                  {[1, 2, 3, 4, 5].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex flex-col items-start">
                <label className="text-sm font-medium mb-1">Children</label>
                <select className="px-4 py-2 border rounded w-full">
                  {[0, 1, 2, 3].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 mt-4 md:mt-6">
              BOOK NOW
            </button>
          </div>
        </div>

        {/* <h2 className="text-3xl font-semibold  text-center">Available Room Bookings</h2> */}
        <div className=" my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((room) => (
            <div key={room} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Room {room}</h3>
              <p className="mb-2">Location: Building A</p>
              <p className="mb-4">Availability: <span className="text-green-600 font-semibold">Available</span></p>
              <button className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Welcome;
