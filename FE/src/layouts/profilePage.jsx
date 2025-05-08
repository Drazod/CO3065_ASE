import React, { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import Sidebar from "../components/user/sidebar";
import "../index.css";
import { useAuth } from "../context/AuthContext";
import EditBookingPopup from "../components/user/editbookingPopUp";
import WeeklyCalendar from "../components/user/weeklyCalendar";
import axiosInstance from '../configs/axiosInstance';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    console.log(booking);
    setEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setEditPopupOpen(false);
    setSelectedBooking(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchData();
  }, []);
  return (
  <div className="flex flex-col md:flex-row min-h-screen bg-[#D6E5E3] text-[#1D1A05] font-sans">
    {/* Sidebar */}
    <Sidebar />
    <div className="flex-1">
      {/* Main Content */}
      <div className="flex-1 my-10 mx-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Profile Card */}
        <section className="col-span-1 bg-[#4A6FA5] rounded-3xl shadow flex flex-col justify-between h-full">
          <div className="p-6">
            <div className="flex items-center">
              <img
                src="https://via.placeholder.com/80"
                alt="Avatar"
                className="rounded-full w-20 h-20 mr-4"
              />
              <div>
                <h2 className="text-2xl font-semibold">{profile?.user.name || "Guest"}</h2>
                <p className="text-gray-600">{profile?.user.role}</p>
              </div>
            </div>
            <div className="mt-4 text-[#1D1A05] flex justify-between">
              <p>ID</p>
              <p className="text-gray-600">{profile?.user._id}</p>
            </div>

            <div className="mt-6 space-y-6">
              <h3 className="font-semibold text-2xl">Profile</h3>
              <p>Address: {profile?.user.address || "No address provided"}</p>
              <p>📞 {profile?.user.phone || "No phone number"}</p>
            </div>
          </div>

          {/* Log out button at the bottom */}
          <button
            onClick={logout}
            className="bg-[#E8F1F2] text-[#1D1A05] py-2 px-4 rounded-b-3xl hover:bg-[#E09891] w-full h-14 flex items-center justify-center"
          >
            <FaSignOutAlt className="mr-2" /> Log out
          </button>
        </section>

        <section className="col-span-2 bg-[#4A6FA5] rounded-2xl p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Weekly Timetable</h2>
          
          <div className="grid grid-cols-7 border-b ml-10 border-gray-200">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
              <div key={day} className="font-bold text-center">{day}</div>
            ))}
          </div>
   
          <div className="relative border rounded overflow-hidden " style={{ height: "470px" }}>
            
            {/* Time Labels (left column) */}
            <div className="absolute left-0 top-0 w-14 h-full border-r border-gray-200">
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
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dayIdx) => (
                <div key={day} className="flex-1 relative border-l border-gray-200">
                  {/* Bookings for this day */}
                  {profile?.user.bookings
                    ?.filter(b => {
                      const d = new Date(b.start);
                      const localDay = (d.getDay() + 6) % 7; // Mon = 0, Sun = 6
                      return localDay === dayIdx;
                    })
                    .map((b, i) => {
                      const start = new Date(b.start);
                      const end = new Date(b.end);
                      const top = ((start.getHours() + start.getMinutes() / 60) - 8) * 45; // px from top
                      const height = ((end - start) / 1000 / 60) * 0.75; // 1px per minute

                      return (
                        <div
                          key={i}
                          className="absolute left-1 right-1 bg-[#E09891] text-white text-xs rounded px-1 py-0.5 shadow"
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          {b.room?.name || "Room"} <br />
                          {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                          {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="mt-10  mx-4 bg-[#4A6FA5] p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Booking history</h2>
        <div className="space-y-4">
          {profile?.user.bookings.map((booking) => (
            <div
              key={booking._id}
              className="flex justify-between items-center bg-[#E8F1F2] px-4 py-3 rounded-lg shadow text-[#1D1A05]"
            >
              <span className="font-bold">#{booking.scheduleId}</span>
              <span>{booking.room?.name}</span>
              <span>{new Date(booking.date).toLocaleDateString()}</span>
              <span>{new Date(booking.start).toLocaleTimeString()}</span>
              <span>{new Date(booking.end).toLocaleTimeString()}</span>
              <button onClick={() => handleEditBooking(booking)} className="text-gray-700 hover:text-[#1D1A05]">Edit</button>
            </div>
          ))}
        </div>
      </section>
      <EditBookingPopup
        show={editPopupOpen}
        booking={selectedBooking}
        onClose={closeEditPopup}
        onUpdated={() => window.location.reload()}
      />
    </div>
  </div>
  );
}
