import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isWithinInterval } from "date-fns";
import "../styles/BookingPage.css";

const BookingPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("token");
    const emailFromStorage = localStorage.getItem("email");

    const [form, setForm] = useState({
        startDate: location.state?.checkInDate || null,
        endDate: location.state?.checkOutDate || null,
        phone: "",
        email: emailFromStorage || ""
    });

    const [user, setUser] = useState({ name: "" });
    const [bookedRanges, setBookedRanges] = useState([]);

    useEffect(() => {
        if (emailFromStorage) {
            axios.get(`http://localhost:8080/api/users/${emailFromStorage}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setUser({ name: res.data.username });
                    setForm(prev => ({ ...prev, email: res.data.email }));
                })
                .catch(err => console.error("Помилка отримання користувача:", err));
        }

        axios.get(`http://localhost:8080/api/bookings/room/${roomId}/booked-dates`)
            .then(res => setBookedRanges(res.data))
            .catch(err => console.error("Помилка отримання дат бронювання:", err));
    }, [emailFromStorage, token, roomId]);

    const isDateDisabled = (date) => {
        return bookedRanges.some(range => {
            const start = new Date(range.start);
            const end = new Date(range.end);
            return isWithinInterval(date, { start, end });
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userRes = await axios.get(`http://localhost:8080/api/users/${emailFromStorage}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userId = userRes.data.id;

            await axios.post("http://localhost:8080/api/bookings", {
                startDate: form.startDate,
                endDate: form.endDate,
                email: form.email,
                phone: form.phone,
                user: { id: userId },
                room: { id: roomId }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Номер успішно заброньовано!");
            navigate("/account");
        } catch (err) {
            console.error(err);
            alert("Не вдалося забронювати: " + (err.response?.data || err.message));
        }
    };

    return (
        <div className="booking-container">

            <h2>Оформлення бронювання номера #{roomId}</h2>
            <form onSubmit={handleSubmit}>
                <label>Ім'я:</label>
                <input value={user.name} disabled/>

                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    required
                />

                <label>Телефон:</label>
                <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    required
                />

                <label>Дата заїзду:</label>
                <DatePicker
                    selected={form.startDate}
                    onChange={(date) => setForm({...form, startDate: date})}
                    filterDate={(date) => !isDateDisabled(date)}
                    minDate={new Date()}
                    placeholderText="Оберіть дату заїзду"
                    dateFormat="yyyy-MM-dd"
                />

                <label>Дата виїзду:</label>
                <DatePicker
                    selected={form.endDate}
                    onChange={(date) => setForm({...form, endDate: date})}
                    filterDate={(date) => {
                        return (
                            !isDateDisabled(date) &&
                            (!form.startDate || date > form.startDate)
                        );
                    }}
                    minDate={form.startDate || new Date()}
                    placeholderText="Оберіть дату виїзду"
                    dateFormat="yyyy-MM-dd"
                />

                <button type="submit" style={{marginTop: "12px"}}>
                    Підтвердити бронювання
                </button>
            </form>
        </div>
    );
};

export default BookingPage;
