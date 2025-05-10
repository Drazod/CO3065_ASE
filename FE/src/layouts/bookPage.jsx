import React,{useState,useEffect} from "react";
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
import RoomPopup from "../components/bookPage/roomdetailPopUp";
import { useAuth } from "../context/AuthContext";
import roomImg from "../assets/room1.jpg";
import axiosInstance from '../configs/axiosInstance';
import RoomBookingPopup from "../components/bookPage/roomBookingPopUp";

import { FaUser, FaCalendarAlt } from "react-icons/fa";

const Booking= () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [room, setRoom] = useState(null);
  const [selectedBase, setSelectedBase] = useState("All");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [minCapacity, setMinCapacity] = useState(1);


  const handleOpenPopup = (roomId) => {
    const found = room?.find(r => r._id === roomId);
    if (found) {
      setSelectedRoom(found);
      setShowPopup(true);
    }
  };
  
  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedRoom(null);
  };

  const getRoom = async () => {
    try {
      const res = await axiosInstance.get('/rooms');
      setRoom(res.data);
      console.log("Available rooms:", res.data);
    } catch (err) {
      console.error("Failed to fetch available rooms:", err);
      alert("Something went wrong while searching for rooms.");
    }
  };

  useEffect(() => {
    getRoom();
  }, []);

  const handleFindRooms = async () => {
    if (!startTime || !endTime) {
      alert("Please select both start and end time.");
      return;
    }
  
    if (startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }
  
    try {

      const dateStr = selectedDate.toISOString().split('T')[0];
      const startStr = startTime.toTimeString().slice(0, 5); 
      const endStr = endTime.toTimeString().slice(0, 5);   
  
      const res = await axiosInstance.post('/rooms/find', {
        date: dateStr,
        start: startStr,
        end: endStr,
        minCapacity
      });
      
  
      setRoom(res.data); // Update room state
      console.log("Available rooms:", res.data);
    } catch (err) {
      console.error("Failed to fetch available rooms:", err);
      alert("Something went wrong while searching for rooms.");
    }
  };
  
  

  const getMonthName = (date) => {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return months[date.getMonth()];
  };

  return (
    
    <div className="relative-container noise-overlay min-h-screen flex flex-col">
      <Header />
      {user?.role === "student" ? (
        <RoomPopup
          show={showPopup}
          roomImage={roomImg}
          roomData={selectedRoom}
          onClose={handleClosePopup}
        />
      ) : (
        <RoomBookingPopup
          show={showPopup}
          roomImage={roomImg}
          roomData={selectedRoom}
          onClose={handleClosePopup}
        />
      )}
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

        <div className=" grid grid-cols-3 gap-4 pb-8 px-12">
          {/* Quote Section */}
          <blockquote className="font-Jsans font-medium text-[#1D1A05] text-2xl leading-[50px]">
            <p className="text-[128px] font-jokey">“</p>
            <p>
              A smart campus begins with smart scheduling. Find your space, book your slot, and make every moment productive.
            </p>
          </blockquote>
          <div className="flex justify-center mt-auto ">
            <button className="flex flex-row items-center bg-[#4A6FA5] px-6 py-2 rounded-xl  text-[#1D1A05] font-bold text-base font-Jsans shadow-md border-[0.5px] border-[#A3A3A3] hover:bg-gray-300 transition">
              <span>SCROLL DOWN</span>
              <div className="relative ml-2 top-1 transform -translate-y-1/2 flex flex-col items-center">
                <img src={down} alt="Scroll Down Icon" className="w-full h-full animate-move-down" />
                <img src={down} alt="Scroll Down Icon" className="w-full h-full animate-move-down" />
              </div>
            </button>
          </div>
          {/* Date */}
          <div className="relative w-fit ml-auto mr-8 mt-14 z-10">
            <div className="absolute left-3 -top-3 flex space-x-8 z-20">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-5 border-[2px] border-blue-900 rounded-full bg-[#1D1A05]"
                  style={{ transform: 'rotate(-20deg)' }}
                ></div>
              ))}
            </div>
            <div className="flex items-center justify-end z-10 space-x-px">
                <div className="flex flex-col items-center justify-center w-20 h-28 bg-[#E09891] border border-blue-900 rounded-md shadow-md">
                  <span className="text-xs tracking-widest font-bold">{getMonthName(selectedDate)}</span>
                  <span className="text-3xl font-black text-[#1D1A05]">{selectedDate.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                </div>
                <div className="flex items-center justify-center w-28 h-28 bg-[#E09891] border border-[#1D1A05] rounded-md shadow-md">
                  <span className="text-6xl font-black text-[#1D1A05]">{selectedDate.getDate()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Booking Filter Section */}
      <section className="py-16 px-8 bg-white text-[#1D1A05]">
        <div className="max-w-5xl mx-auto p-8 rounded-3xl shadow-md bg-[#4A6FA5]">
          <h2 className="text-3xl font-semibold text-center mb-1">Book a Room</h2>
          <p className="text-center text-[#1D1A05] mb-8">Discover the perfect space for you!</p>

          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            {/* Date Picker */}
            <div className="flex flex-col items-start">
              <label className="text-sm font-medium mb-1">Date</label>
              <div className="flex items-center bg-[#E8F1F2] px-4 py-2 rounded shadow-sm">
                <FaCalendarAlt className="mr-2 text-[#1D1A05]" />
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  placeholderText="Check Available"
                  dateFormat="dd/MM/yyyy"
                  className="outline-none bg-transparent"
                  minDate={new Date()}
                />
              </div>
            </div>

            {/* Start Time Picker */}
            <div className="flex flex-col items-start">
              <label className="text-sm font-medium mb-1">Start Time</label>
              <DatePicker
                selected={startTime}
                onChange={(date) => setStartTime(date)}
                showTimeSelectOnly
                showTimeInput
                inline
                dateFormat="h:mm aa"
                className="!bg-transparent outline-none"
                
              />
            </div>

            {/* End Time Picker */}
            <div className="flex flex-col items-start">
              <label className="text-sm font-medium mb-1">End Time</label>
              <DatePicker
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                showTimeSelectOnly
                showTimeInput
                inline
                dateFormat="h:mm aa"
                className="!bg-transparent outline-none"
              />
            </div>


            {/* Seats Picker */}
            <div className="flex flex-col items-start">
              <label className="text-sm font-medium mb-1">Seats</label>
              <div className="flex items-center gap-2 bg-[#E8F1F2] px-4 py-2 rounded shadow-sm">
                <FaUser />
                <span>Students</span>
                <select
                  className="px-2 py-1 rounded border border-gray-300"
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 10, 15, 20, 30, 100].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <button onClick={handleFindRooms} className="bg-[#D6E5E3] font-bold text-[#1D1A05] px-6 py-3 rounded hover: mt-4 md:mt-6">
              FIND
            </button>
          </div>
        </div>
      </section>

      {/* Room Booking List Section */}
      <section className="py-16 px-8 text-[#1D1A05]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-semibold">Available room</h2>
            <p className="text-sm ">
              Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
            </p>
          </div>
          <div className="flex overflow-hidden border-x rounded-bl-[80px] rounded-br-[80px] bg-gradient-to-r from-white via-[#4A6FA5] to-white py-[1px] pt-[1px] pb-1">
            {["All", "Base 1", "Base 2"].map(base => (
              <button
                key={base}
                onClick={() => setSelectedBase(base)}
                className={`px-10 py-4 text-sm font-semibold ${
                  selectedBase === base ? "bg-[#4A6FA5] text-white" : "bg-white"
                } ${base === "All" ? "rounded-bl-[80px]" : ""} ${base === "Base 2" ? "rounded-br-[80px]" : ""}`}
              >
                {base}
              </button>
            ))}
          </div>
        </div>




        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {room?.length > 0 ? (
            room
            .filter(r => selectedBase === "All" || r.building === selectedBase)
            .map((r, i) => (          
              <div key={r._id || i} className="flex bg-white rounded-xl shadow-md overflow-hidden">
                {/* Image */}
                <img
                  src={roomImg} // replace with dynamic image if available: r.imageUrl || roomImg
                  alt={r.name}
                  className="w-1/3 object-cover h-full rounded-l-xl"
                />

                {/* Info Section */}
                <div className="flex-grow p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{r.name}</h3>
                    <p className="text-sm text-gray-600">{r.location || 'No location info'}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 text-xl">🛏️</span>
                      <span className="text-gray-800 font-semibold">{r.capacity || 0}</span>
                    </div>
                    <div className="flex gap-2 text-2xl">
                      <span>🎤</span>
                      <span>🖥️</span>
                      <span>📸</span>
                    </div>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={() => handleOpenPopup(r._id)} // optionally pass room info to popup
                  className="w-24 bg-[#4A6FA5] text-white text-center flex items-center justify-center text-lg font-bold rounded-l-xl"
                >
                  BOOK
                </button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-2 text-gray-500">No rooms found.</p>
          )}
        </div>




        <div className="flex justify-center mt-6">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-gray-300 rounded-full"></div>
            ))}
          </div>
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

export default Booking;
