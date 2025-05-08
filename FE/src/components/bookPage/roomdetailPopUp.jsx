import React, {useState}from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../../configs/axiosInstance";
import { useAuth } from "../../context/AuthContext"; // Adjust path as needed
import { useNavigate } from "react-router-dom";


const RoomPopup = ({ show, onClose, roomImage, roomData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const { user } = useAuth(); 
  const navigate = useNavigate();
  const bookRoom = async (roomId, date, startTime, endTime) => {
    try {
      if (!user) {
        alert("Please log in to book a room.");
        navigate("/login");
        return;
      }
      const dateStr = selectedDate.toISOString().split('T')[0];
      const startStr = startTime.toTimeString().slice(0, 5); // e.g., "10:30"
      const endStr = endTime.toTimeString().slice(0, 5);     // e.g., "12:00"
      const response = await axiosInstance.post(`/rooms/${roomId}/schedule`, {
        schedules: [
          {
            date: dateStr,
            start: startStr,
            end: endStr
          }
        ]
      });
  
      alert("Room booked successfully!");
      console.log(response.data);
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Booking failed");
    }
  };
  
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
       

            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText="Check Available"
              dateFormat="dd/MM/yyyy"
              className="outline-none bg-transparent"
              minDate={new Date()}
            />
            <FaCalendarAlt className="mr-2 text-[#1D1A05]" />
          </div>
          {/* Time Selectors */}
          <div className="flex  gap-4 mb-4 justify-between">
            <div className="bg-[#D6E5E3] w-1/2 pl-2 rounded text-lg outline-none">
              <label className="text-sm mb-1">Start Time</label>
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

            <div className="bg-[#D6E5E3] w-1/2 pl-2  rounded text-lg outline-none">
              <label className="text-sm mb-1">End Time</label>
              <DatePicker
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                showTimeSelectOnly
                showTimeInput
                inline
                dateFormat="h:mm aa"
                className="outline-none"
              />
            </div>
          </div>
          {/* Room Info */}
          <h3 className="text-lg font-semibold mb-2 ">{roomData.name}</h3>
          <p className="text-sm mb-4">
            {roomData.description}
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
              onClick={() => bookRoom(roomData._id, selectedDate, startTime, endTime)}
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
