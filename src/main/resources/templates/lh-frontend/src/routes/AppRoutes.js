import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Rooms from "../pages/Rooms";
// import Booking from "../pages/Booking";
import AdminPanel from "../pages/AdminPanel";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Account from "../pages/Account";
import BookingPage from "../pages/BookingPage";
import MyBookings from "../pages/MyBookings";
import AdminStatisticsPage from "../pages/AdminStatisticsPage";
import RoomDetailsPage from "../pages/RoomDetailsPage";
import AdminBookings from "../pages/AdminBookings";



const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/booking/:roomId" element={<BookingPage />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/book/:roomId" element={<BookingPage />} />
            <Route path="/admin/statistics" element={<AdminStatisticsPage />} />
            <Route path="/adminadd" element={<AdminPanel />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/rooms/:roomId" element={<RoomDetailsPage />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />

        </Routes>
    );
};

export default AppRoutes;
