import React,{useState} from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import middle from "../assets/store/middle.png";
import smalleft from "../assets/store/smalleft.png";
import bigleft from "../assets/store/bigleft.png";
import left from "../assets/store/left.png";
import right from "../assets/store/right.png";
import bigright from "../assets/store/bigright.png";
import smallright from "../assets/store/smallright.png";
import down from "../assets/store/down.png";
import alt from "../assets/store/alt.png";
import DatePicker from "react-datepicker";
import { FaUser, FaCalendarAlt } from "react-icons/fa";

const FashionTemplate = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="relative-container noise-overlay min-h-screen flex flex-col">
      <Header />

      <section className="relative pt-52 h-full flex flex-col items-center justify-center">
        {/* Hero Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-6 font-Jsans text-[#353535]">
            Seamless Campus Booking<br /> Starts Here
          </h1>
        </div>
        <div className="h-full grid grid-cols-5 gap-1  p-8 place-items-center">
          {/* Images */}
          <div className="col-span-1 col-start-1 ">
            <img
              src={left}
              alt="Campus Room"
              className="w-full h-full object-cover transition-transform duration-100 hover:scale-110"
            />
          </div>
          <div className="col-span-1 col-start-2">
            <div className="grid grid-rows-2 gap-0 place-items-start">
              <img src={smalleft} alt="Lab" className="w-full h-auto object-cover transition-transform duration-100 hover:scale-110" />
              <img src={bigleft} alt="Seminar Room" className="w-full h-auto object-cover transition-transform duration-100 hover:scale-110" />
            </div>
          </div>
          <div className="col-span-1 col-start-3 ">
            <img
              src={middle}
              alt="Main Hall"
              className="w-full h-full object-cover transition-transform duration-100 hover:scale-110"
            />
          </div>
          <div className="col-span-1 col-start-4">
            <div className="grid grid-rows-2 gap-0 place-items-end">
              <img src={bigright} alt="Meeting Space" className="w-full h-auto object-cover transition-transform duration-100 hover:scale-110" />
              <img src={smallright} alt="Breakout Area" className="w-full h-auto object-cover transition-transform duration-100 hover:scale-110" />
            </div>
          </div>
          <div className="col-span-1 col-start-5">
            <img
              src={right}
              alt="Study Room"
              className="w-full h-full object-cover transition-transform duration-100 hover:scale-110"
            />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-4 pb-8 px-12">
          {/* Quote Section */}
          <blockquote className="font-Jsans font-medium text-[#434237] text-2xl leading-[50px]">
            <p className="text-[128px] font-jokey">“</p>
            <p>
              A smart campus begins with smart scheduling. Find your space, book your slot, and make every moment productive.
            </p>
          </blockquote>
          <div className="flex justify-center mt-auto ">
            <button className="flex flex-row items-center bg-[#4d77f5c5] px-6 py-2 rounded-xl  text-black font-bold text-base font-Jsans shadow-md border-[0.5px] border-[#A3A3A3] hover:bg-gray-300 transition">
              <span>SCROLL DOWN</span>
              <div className="relative ml-2 top-1 transform -translate-y-1/2 flex flex-col items-center">
                <img src={down} alt="Scroll Down Icon" className="w-full h-full animate-move-down" />
                <img src={down} alt="Scroll Down Icon" className="w-full h-full animate-move-down" />
              </div>
            </button>
          </div>
          {/* Pagination */}
          <div className="flex space-x-4 mt-auto ml-auto mr-8 z-10 items-center">
            <button className="border-2 h-12 w-12 flex justify-center items-center align-middle rounded-full text-white hover:bg-gray-400">{"<"}</button>
            <button className="h-12 w-12 flex justify-center items-center align-middle rounded-full bg-[#111655] text-white hover:bg-gray-400">{">"}</button>
            <span className="text-[#434237] font-kaisei text-5xl">01 <span className="text-base">/ 05</span></span>
          </div>
        </div>
      </section>

      {/* Room Booking Filter Section */}
      <section className="py-16 px-8 bg-white text-gray-800">
        <div className="max-w-5xl mx-auto p-8 rounded-3xl shadow-md bg-blue-100">
          <h2 className="text-3xl font-semibold text-center mb-1">Book a Room</h2>
          <p className="text-center text-gray-600 mb-8">Discover the perfect space for you!</p>

          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            {/* Date Picker */}
            <div className="flex flex-col items-start">
              <label className="text-sm font-medium mb-1">Date</label>
              <div className="flex items-center bg-white px-4 py-2 rounded shadow-sm">
                <FaCalendarAlt className="mr-2 text-gray-500" />
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  placeholderText="Check Available"
                  dateFormat="dd/MM/yyyy"
                  className="outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Person Picker */}
            <div className="flex flex-col items-start">
              <label className="text-sm font-medium mb-1">Size</label>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded shadow-sm">
                <FaUser className="text-gray-600" />
                <span>Adults</span>
                <select className="px-2 py-1 rounded border border-gray-300">
                  {[1, 2, 3, 4, 5].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 mt-4 md:mt-6">
              BOOK NOW
            </button>
          </div>
        </div>
      </section>

      {/* Room Booking List Section */}
      <section className="py-16 px-8 bg-gray-100 text-gray-800">
        <h2 className="text-3xl font-semibold mb-12 text-center">Available Room Bookings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Recently Viewed Section */}
      {/* <section className="py-16 px-8 h-full text-center ">
        <h2 className="text-3xl font-Jsans mb-8">Recently viewed</h2>
      </section> */}

      <section className=" py-8 px-12 font-Jsans">
        <div className="container  text-left">
          <h2 className="text-3xl  mb-4">Quick Link</h2>
          <div className="flex flex-wrap gap-4 mb-6">
            <button className="px-6 py-2 flex items-center text-[#434237] rounded-full border border-[#434237] hover:bg-gray-300 transition">
            <span>Order Status</span>
            <img
              src={alt}
              alt="icon"
              className="w-6 h-auto object-contain"
            />
            </button>
            <button className="px-6 py-2 flex items-center text-[#434237] rounded-full border border-[#434237] hover:bg-gray-300 transition">
              Shopping Help
              <img
              src={alt}
              alt="icon"
              className="w-6 h-auto object-contain"
            />
            </button>
            <button className="px-6 py-2 flex items-center text-[#434237] rounded-full border border-[#434237] hover:bg-gray-300 transition">
              Return
              <img
              src={alt}
              alt="icon"
              className="w-6 h-auto object-contain"
            />
            </button>
            <button className="px-6 py-2 flex items-center text-[#434237] rounded-full border border-[#434237] hover:bg-gray-300 transition">
              Your Saves
              <img
              src={alt}
              alt="icon"
              className="w-6 h-auto object-contain"
            />
            </button>
          </div>
          <p className="text-[#434237] text-sm font-light leading-relaxed">
            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FashionTemplate;
