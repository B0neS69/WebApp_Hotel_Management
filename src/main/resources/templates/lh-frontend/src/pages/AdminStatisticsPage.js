import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';
import '../styles/adminStyles.css';
Chart.register(BarElement, CategoryScale, LinearScale);

const AdminStatistics = () => {
    const [activeBookingsCount, setActiveBookingsCount] = useState(0);
    const [roomStats, setRoomStats] = useState({});
    const [revenueStats, setRevenueStats] = useState([]); // ➡️ новий стейт
    const [confirmedCount, setConfirmedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [cancelledCount, setCancelledCount] = useState(0);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const [roomBookingsRes, revenueStatsRes, confirmedRes, pendingRes, cancelledRes, roomsRes] = await Promise.all([
                axios.get('http://localhost:8080/admin/statistics/room-active-bookings', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:8080/admin/statistics/room-revenue', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:8080/admin/statistics/bookings/confirmed', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:8080/admin/statistics/bookings/pending', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:8080/admin/statistics/bookings/cancelled', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:8080/admin/rooms', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
            ]);

            setRoomStats(roomBookingsRes.data);
            setRevenueStats(revenueStatsRes.data);
            setConfirmedCount(confirmedRes.data);
            setPendingCount(pendingRes.data);
            setCancelledCount(cancelledRes.data);
            setRooms(roomsRes.data); // 👈 тут важливо
        } catch (err) {
            console.error("Помилка при отриманні статистики:", err);
        }
    };


    const [rooms, setRooms] = useState([]);


    const chartData = {
        labels: Object.keys(roomStats).map(roomId => {
            const room = rooms?.find(r => r.id.toString() === roomId);
            return room ? `${room.number || room.roomName}` : `ID ${roomId}`;
        }),
        datasets: [
            {
                label: 'Кількість активних бронювань на номер',
                data: Object.values(roomStats),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }
        ]
    };


    const handleExportExcel = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/statistics/export', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob'  // ⬅️ ключове для отримання файлу
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'statistics.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Помилка при експорті в Excel:", error);
        }
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: { beginAtZero: true }
        }
    };

    return (
        <div className="admin-statistics-container">
            <h2>Статистика бронювань</h2>

            <div style={{marginBottom: "20px"}}>
                <h3>🔹 Статистика замовлень за статусами:</h3>
                <ul>
                    <li>✅ Підтверджені: <strong>{confirmedCount}</strong></li>
                    <li>🕓 Очікують підтвердження: <strong>{pendingCount}</strong></li>
                    <li>❌ Скасовані: <strong>{cancelledCount}</strong></li>
                </ul>
            </div>


            <div style={{marginBottom: "40px"}}>
                <h3>🔹 Підтверджені бронювання по кожному номеру:</h3>
                {Object.keys(roomStats).length > 0 ? (
                    <Bar data={chartData} options={chartOptions}/>
                ) : (
                    <p>Немає даних для відображення</p>
                )}
            </div>

            <div>
                <h3>🔹 Статистика доходів по номерах:</h3>
                {revenueStats.length > 0 ? (
                    <table style={{width: "100%", borderCollapse: "collapse"}}>
                        <thead>
                        <tr>
                            <th style={{border: "1px solid black", padding: "8px"}}>ID Номера</th>
                            <th style={{border: "1px solid black", padding: "8px"}}>Тип Номера</th>
                            <th style={{border: "1px solid black", padding: "8px"}}>Кількість Бронювань</th>
                            <th style={{border: "1px solid black", padding: "8px"}}>Сума Доходу (₴)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {revenueStats.map(room => (
                            <tr key={room.roomId}>
                                <td style={{border: "1px solid black", padding: "8px"}}>{room.roomId}</td>
                                <td style={{border: "1px solid black", padding: "8px"}}>{room.roomType}</td>
                                <td style={{border: "1px solid black", padding: "8px"}}>{room.bookingsCount}</td>
                                <td style={{
                                    border: "1px solid black",
                                    padding: "8px"
                                }}>{room.totalRevenue.toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Немає даних для відображення</p>
                )}
            </div>
            <div style={{marginBottom: "20px"}}>
                <button onClick={handleExportExcel} style={{
                    padding: "10px 20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}>
                    📥 Експортувати в Excel
                </button>
            </div>

        </div>
    );
};

export default AdminStatistics;
