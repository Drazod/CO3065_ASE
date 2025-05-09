import React, { useEffect, useState } from "react";
import axiosInstance from "../../configs/axiosInstance";

const AllRoomTimetable = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get('/rooms');
        setRooms(res.data);
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      }
    };
    fetch();
  }, []);

  return (
    <section className="mt-10 mx-4 bg-[#4A6FA5] p-6 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-white">All Room Schedules</h2>
      
      <div className="grid grid-cols-7 border-b ml-10 border-gray-200 text-white">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
          <div key={day} className="font-bold text-center">{day}</div>
        ))}
      </div>

      <div className="relative border rounded overflow-hidden bg-white" style={{ height: "470px" }}>
        {/* Time Labels */}
        <div className="absolute left-0 top-0 w-14 h-full border-r border-gray-200 bg-white z-10">
          {Array.from({ length: 11 }).map((_, i) => {
            const hour = 8 + i;
            return (
              <div key={hour} className="h-[45px] text-xs text-right pr-1 text-gray-600">
                {hour}:00
              </div>
            );
          })}
        </div>

        {/* Day Columns */}
        <div className="ml-14 flex h-full">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((_, dayIdx) => (
            <div key={dayIdx} className="flex-1 relative border-l border-gray-200">
              {rooms.flatMap((room) =>
                room.schedules
                  ?.filter(sch => {
                    const d = new Date(sch.start);
                    const localDay = (d.getDay() + 6) % 7; // convert Sun=0 to Sun=6
                    return localDay === dayIdx;
                  })
                  .map((sch, i) => {
                    const start = new Date(sch.start);
                    const end = new Date(sch.end);
                    const top = ((start.getHours() + start.getMinutes() / 60) - 8) * 45;
                    const height = ((end - start) / 1000 / 60) * 0.75;

                    return (
                      <div
                        key={i}
                        className="absolute left-1 right-1 bg-[#E09891] text-white text-xs rounded px-1 py-0.5 shadow"
                        style={{ top: `${top}px`, height: `${height}px` }}
                      >
                        {room.name}<br />
                        {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                        {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    );
                  })
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllRoomTimetable;
