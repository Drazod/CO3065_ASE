import React from "react";

const RoomPopup = ({ show, onClose, roomImage }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#E8F1F2] rounded-lg shadow-lg w-[90%] text-[#1D1A05] md:w-[600px] flex flex-col md:flex-row overflow-hidden">
        <img
          src={roomImage}
          alt="Service"
          className="w-full md:w-1/2 h-auto object-cover"
        />
        <div className="p-6 md:w-1/2 ">
          {/* Filter Header */}
          <h3 className="text-xl font-bold  mb-2">New Booking</h3>
          {/* Date Picker */}
          <div className="bg-[#D6E5E3] rounded p-2 flex items-center justify-between mb-3">
            <input
              type="date"
              className="bg-transparent w-full  text-lg outline-none"
            />
            <span className="text-xl">&#128197;</span>
          </div>
          {/* Time Selectors */}
          <div className="flex gap-2 mb-4">
            <select className="bg-[#D6E5E3]  w-1/2 p-2 rounded text-lg outline-none">
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>12:00 PM</option>
            </select>
            <select className="bg-[#D6E5E3] w-1/2 p-2 rounded text-lg outline-none">
              <option>12:00 PM</option>
              <option>1:00 PM</option>
              <option>2:00 PM</option>
            </select>
          </div>

          {/* Room Info */}
          <h3 className="text-lg font-semibold mb-2 ">Room B4-302</h3>
          <p className="text-sm mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
          </p>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="bg-[#4A6FA5] hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Close
            </button>
            <button
              className="bg-[#E09891] hover:bg-red-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPopup;
