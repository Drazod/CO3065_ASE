import React, {useState}from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../../configs/axiosInstance";
import { useAuth } from "../../context/AuthContext"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
const RoomScheduleCalendar = ({ schedules }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="relative border rounded overflow-hidden" style={{ height: "470px" }}>
      {/* Time Labels */}
      <div className="absolute left-0 top-0 w-14 h-full border-r border-gray-200 bg-white z-10">
        {Array.from({ length: 11 }).map((_, i) => {
          const hour = 8 + i;
          return (
            <div
              key={hour}
              className="h-[45px] text-xs text-right pr-1 text-gray-600"
            >
              {hour}:00
            </div>
          );
        })}
      </div>

      {/* Columns */}
      <div className="ml-14 flex h-full">
        {days.map((day, dayIdx) => (
          <div
            key={dayIdx}
            className="flex-1 relative border-l border-gray-200"
          >
            {schedules
              .filter((s) => {
                const d = new Date(s.start);
                const localDay = (d.getDay() + 6) % 7; // Convert Sunday to 6
                return localDay === dayIdx;
              })
              .map((s, i) => {
                const start = new Date(s.start);
                const end = new Date(s.end);
                const top = ((start.getHours() + start.getMinutes() / 60) - 8) * 45;
                const height = ((end - start) / 60000) * 0.75;

                return (
                  <div
                    key={i}
                    className="absolute left-1 right-1 bg-[#E09891] text-white text-xs rounded px-1 py-0.5 shadow"
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

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
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    }
  };
  
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[95%] max-w-6xl rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Column: Image and Info */}
        <div className="w-full md:w-1/3 flex flex-col border-r border-gray-300">
          <div className="h-64 bg-gray-200">
            <img src={roomImage} alt="Room" className="w-full h-full object-cover" />
          </div>
          <div className="p-4 space-y-2 bg-[#E8F1F2] flex-1">
            <h2 className="text-xl font-bold">{roomData?.name}</h2>
            <p className="text-sm text-gray-600">{roomData?.description}</p>
            <p className="text-sm">📍 {roomData?.location}</p>
            <p className="text-sm">🏢 {roomData?.building}</p>
            <p className="text-sm">🪑 Capacity: {roomData?.capacity}</p>
          </div>
        </div>
        <div className="w-full md:w-2/3 bg-white p-4 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-2">Weekly Schedule</h3>
          <RoomScheduleCalendar schedules={roomData?.schedules || []} />
        </div>
      </div>

    </div>
  );
};

export default RoomPopup;
