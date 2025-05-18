import React, { useEffect, useState } from "react";
import axios from "axios";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    useEffect(() => {
        axios.get(`http://localhost:8080/api/users/${email}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            const userId = res.data.id;
            return axios.get(`http://localhost:8080/api/bookings/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }).then(res => {
            setBookings(res.data);
        }).catch(err => {
            console.error("Помилка завантаження бронювань:", err);
        });
    }, []);

    const handleCancel = async (bookingId) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/bookings/cancel/${bookingId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(response.data);
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "CANCELED" } : b));
        } catch (err) {
            alert(err.response?.data || "Не вдалося скасувати бронювання.");
        }
    };

    return (
        <div>
            <h2>Мої бронювання</h2>
            {bookings.length === 0 ? (
                <p>Немає активних бронювань.</p>
            ) : (
                <table border="1" cellPadding="8" style={{ width: "100%", textAlign: "center" }}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Номер</th>
                        <th>Дата заїзду</th>
                        <th>Дата виїзду</th>
                        <th>Ціна</th>
                        <th>Статус</th>
                        <th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bookings.map(booking => (
                        <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{booking.room?.type}</td>
                            <td>{booking.startDate}</td>
                            <td>{booking.endDate}</td>
                            <td>{booking.price} грн</td>
                            <td>{booking.status}</td>
                            <td>
                                {booking.status === "PENDING" && new Date(booking.startDate) > new Date(Date.now() + 24 * 60 * 60 * 1000) ? (
                                    <button onClick={() => handleCancel(booking.id)}>❌ Скасувати</button>
                                ) : (
                                    "-"
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyBookings;
