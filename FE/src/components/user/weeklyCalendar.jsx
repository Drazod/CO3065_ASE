import React, { useEffect, useState } from "react";
import axiosInstance from "../../configs/axiosInstance";

const WeeklyCalendar = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        setBookings(res.data.user.bookings || []);
      } catch (err) {
        console.error("Failed to load bookings", err);
      }
    };

    fetchBookings();
  }, []);

  const hours = Array.from({ length: 10 }, (_, i) => i);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="relative w-full overflow-x-auto">
      {/* Time Labels */}
      <div className="absolute left-0 top-0 w-[60px] z-10">
        {hours.map((h) => (
          <div key={h} className="h-[50px] text-xs text-right pr-2">
            {`${h}:00`}
          </div>
        ))}
      </div>

      {/* Week Grid */}
      <div className="ml-[60px] grid grid-cols-7 border-t border-l border-gray-300" style={{ height: `${24 * 50}px` }}>
        {days.map((_, dayIndex) => (
          <div key={dayIndex} className="relative border-r border-gray-300">
            {hours.map((_, h) => (
              <div key={h} className="h-[50px] border-b border-gray-200"></div>
            ))}
          </div>
        ))}

        {/* Booking blocks */}
        {bookings.map((b, i) => {
          const start = new Date(b.start);
          const end = new Date(b.end);
          const day = (start.getDay() + 6) % 7; // Convert Sunday=0 to end

          const startHour = start.getHours() + start.getMinutes() / 60;
          const endHour = end.getHours() + end.getMinutes() / 60;

          const top = startHour * 50;
          const height = (endHour - startHour) * 50;

          return (
            <div
              key={i}
              className="absolute bg-red-500 text-white text-xs rounded px-1 shadow"
              style={{
                top: `${top}px`,
                height: `${height}px`,
                left: `${day * 100}px`,
                width: "95px",
                marginLeft: "60px"
              }}
            >
              {b.room?.name || "Room"} <br />
              {new Date(b.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
              {new Date(b.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
