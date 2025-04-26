import React, { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import Sidebar from "../components/user/sidebar";
import "../index.css";
import { useAuth } from "../context/AuthContext";
import axiosInstance from '../configs/axiosInstance';

export default function ProfilePage() {
  const [rooms, setRooms] = useState([]);
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([
    { id: "#1234", items: "Shirt,Jean", date: "10/12/2024", price: "200.000 VND" },
    { id: "#1235", items: "Shirt,Jean", date: "11/12/2024", price: "200.000 VND" },
    { id: "#1236", items: "Shirt,Jean", date: "12/12/2024", price: "200.000 VND" }
  ]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        setProfile(res.data);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
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
          <h2 className="text-lg font-semibold mb-4">Notification</h2>
          <div className="space-y-6 text-sm text-[#1D1A05]">
            <div>
              <strong>New Product</strong>
              <p className="text-xs">Look at out last release <br />Winter collection with good design <a href="#" className="text-blue-600">@click here</a></p>
              <p className="text-gray-500 text-xs">8 min ago</p>
            </div>
            <hr />
            <div>
              <strong>Your order had arrived</strong>
              <p className="text-xs">Order #1233 <br />Any question about refund <a href="#" className="text-blue-600">@click here</a></p>
              <p className="text-gray-500 text-xs">12 min ago</p>
            </div>
            <hr />
            <div>
              <strong>New Voucher</strong>
              <p className="text-xs">Limited time <br /><a href="#" className="text-blue-600">Go shopping now</a></p>
              <p className="text-gray-500 text-xs">18 min ago</p>
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
              <span className="font-bold">{booking.id}</span>
              <span>{booking.room?.name}</span>
              <span>{new Date(booking.date).toLocaleDateString()}</span>
              <span>{booking.hour}</span>
              <button className="text-gray-700 hover:text-[#1D1A05]">▼</button>
            </div>
          ))}
        </div>
      </section>
    </div>
    </div>
  );
}
