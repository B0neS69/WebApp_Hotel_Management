import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isWithinInterval } from "date-fns";
import "../styles/adminStyles.css";

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [bookedRanges, setBookedRanges] = useState([]);
    const [formData, setFormData] = useState({
        roomId: "",
        startDate: null,
        endDate: null,
        phone: "",
    });
    const emailFromStorage = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchBookings();
        fetchRooms();
    }, []);

    useEffect(() => {
        if (formData.roomId) {
            fetchBookedDates(formData.roomId);
        }
    }, [formData.roomId]);

    const fetchBookings = async () => {
        const res = await axios.get("http://localhost:8080/api/bookings/all", {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(res.data);
        setBookings(res.data);
    };

    const fetchRooms = async () => {
        const res = await axios.get("http://localhost:8080/admin/rooms", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setRooms(res.data);
    };

    const fetchBookedDates = async (roomId) => {
        const res = await axios.get(`http://localhost:8080/api/bookings/room/${roomId}/booked-dates`);
        setBookedRanges(res.data);
    };

    const isDateDisabled = (date) => {
        return bookedRanges.some(range => {
            const start = new Date(range.start);
            const end = new Date(range.end);
            return isWithinInterval(date, { start, end });
        });
    };

    const calculatePrice = () => {
        const room = rooms.find(r => r.id.toString() === formData.roomId);
        if (!room || !formData.startDate || !formData.endDate) return "";
        const days = Math.ceil((formData.endDate - formData.startDate) / (1000 * 60 * 60 * 24));
        return days > 0 ? days * room.price : "";
    };

    const createBooking = async () => {
        const price = calculatePrice();
        if (!price) {
            alert("Некоректна дата або номер.");
            return;
        }

        try {
            const userRes = await axios.get(`http://localhost:8080/api/users/${emailFromStorage}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userId = userRes.data.id;
            await axios.post("http://localhost:8080/api/bookings/admin/create-booking", {
                startDate: formData.startDate,
                endDate: formData.endDate,
                email: formData.email,
                phone: formData.phone,
                user: { id: userId },
                room: { id: formData.roomId }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Бронювання створено.");
            fetchBookings();
        } catch (err) {
            alert("Помилка: " + (err.response?.data || err.message));
        }
    };

    const confirmBooking = async (id) => {
        await axios.put(`http://localhost:8080/api/bookings/admin/confirm/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchBookings();
    };

    const cancelBooking = async (id) => {
        const confirmed = window.confirm("Ви дійсно хочете скасувати це бронювання?");
        if (confirmed) {
            await axios.put(`http://localhost:8080/api/bookings/admin/cancel/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBookings();
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Місяці починаються з 0
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    const completeBooking = async (id) => {
        try {
            await axios.post(`http://localhost:8080/admin/bookings/${id}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBookings(); // оновлення списку після зміни
        } catch (error) {
            console.error("Failed to complete booking:", error);
        }
    };


    return (
        <div className="admin-bookings-container">
            <h2>📋 Адміністративні бронювання</h2>

            <table border="1" style={{width: "100%", marginBottom: "40px"}}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Номер</th>
                    <th>Дати</th>
                    <th>Ціна</th>
                    <th>Телефон</th>
                    <th>Статус</th>
                    <th>Хто створив</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {bookings.map(b => (
                    <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>{b.roomNumber || "N/A"}</td>
                        <td>{formatDate(b.startDate)} ➜ {formatDate(b.endDate)}</td>
                        <td>{b.price} грн</td>
                        <td>{b.phone}</td>
                        <td>{b.status}</td>
                        <td>{b.createdBy || "USER"}</td>
                        <td>
                            {b.status === "PENDING" && (
                                <>
                                    <button onClick={() => confirmBooking(b.id)}>✅ Підтвердити</button>
                                    {" "}
                                    <button onClick={() => cancelBooking(b.id)}>❌ Скасувати</button>
                                </>
                            )}
                            {b.status === "CONFIRMED" && (
                                <>
                                    <button onClick={() => completeBooking(b.id)}>✅ Завершити</button>
                                    {" "}
                                    <button onClick={() => cancelBooking(b.id)}>❌ Скасувати</button>
                                </>
                            )}
                        </td>


                    </tr>
                ))}
                </tbody>
            </table>

            <h3>➕ Створити нове бронювання</h3>
            <div>
                <select
                    name="roomId"
                    value={formData.roomId}
                    onChange={e => setFormData({...formData, roomId: e.target.value})}
                >
                    <option value="">-- Виберіть номер --</option>
                    {rooms.map(r => (
                        <option key={r.id} value={r.id}>
                            {r.type} (₴{r.price})
                        </option>
                    ))}
                </select>

                <DatePicker
                    selected={formData.startDate}
                    onChange={(date) => setFormData({...formData, startDate: date})}
                    filterDate={(date) => !isDateDisabled(date)}
                    minDate={new Date()}
                    placeholderText="Дата заїзду"
                    dateFormat="yyyy-MM-dd"
                />

                <DatePicker
                    selected={formData.endDate}
                    onChange={(date) => setFormData({...formData, endDate: date})}
                    filterDate={(date) =>
                        !isDateDisabled(date) &&
                        (!formData.startDate || date > formData.startDate)
                    }
                    minDate={formData.startDate || new Date()}
                    placeholderText="Дата виїзду"
                    dateFormat="yyyy-MM-dd"
                />

                <input
                    type="tel"
                    placeholder="Номер телефону"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                />

                <p>💰 Автоматична ціна: <strong>{calculatePrice() || "—"}</strong> грн</p>

                <button onClick={createBooking}>💾 Створити</button>
            </div>
        </div>
    );
};

export default AdminBookings;
