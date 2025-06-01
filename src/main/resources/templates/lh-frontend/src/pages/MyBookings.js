import React, { useEffect, useState } from "react";
import axios from "axios";
import '../styles/myBookingsStyles.css';


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
            console.log(res.data)
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
    const isCancelable = (startDate, status) => {
        if (status !== "PENDING") return false;
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const bookingDate = new Date(startDate);

        // Обнулення часу (важливо для коректного порівняння)
        bookingDate.setHours(0, 0, 0, 0);
        tomorrow.setHours(0, 0, 0, 0);

        return bookingDate > tomorrow;
    };
    const formatDate = (isoDateStr) => {
        const date = new Date(isoDateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // бо getMonth() з 0
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="my-bookings-container">
            <h2>Мої бронювання</h2>
            {bookings.length === 0 ? (
                <p>Немає активних бронювань.</p>
            ) : (
                <table>
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
                            <td>{booking.roomNumber}</td>
                            <td>{formatDate(booking.startDate)}</td>
                            <td>{formatDate(booking.endDate)}</td>
                            <td>{booking.price} грн</td>
                            <td>{booking.status}</td>
                            <td>
                                {isCancelable(booking.startDate, booking.status) ? (
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
