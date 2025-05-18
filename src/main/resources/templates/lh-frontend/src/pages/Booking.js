import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRoomById, createBooking } from "../api/api";

const Booking = () => {
    const { roomId } = useParams();  // Отримуємо ID з URL
    const [room, setRoom] = useState(null);
    const [customerName, setCustomerName] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        fetchRoomById(roomId).then(response => setRoom(response.data));
    }, [roomId]);

    const handleBooking = async () => {
        const bookingData = { roomId, customerName, date };
        try {
            await createBooking(bookingData);
            alert("Бронювання успішне!");
        } catch (error) {
            alert("Помилка бронювання.");
        }
    };

    if (!room) return <p>Завантаження...</p>;

    return (
        <div className="booking-container">
            <h2>Бронювання номера: {room.type}</h2>
            <p>Ціна: {room.price} грн</p>

            <label>Ім'я:</label>
            <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
            />

            <label>Дата заїзду:</label>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            <button onClick={handleBooking}>Забронювати</button>
        </div>
    );
};

export default Booking;
