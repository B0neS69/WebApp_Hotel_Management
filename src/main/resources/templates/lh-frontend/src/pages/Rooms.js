import React, { useEffect, useState } from "react";
import { fetchRooms } from "../api/api";
import RoomCard from "../components/RoomCard";
import "../styles/RoomCard.css";
const Rooms = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetchRooms().then(response => setRooms(response.data));
    }, []);

    return (
        <div>
            <h2>Доступні номери</h2>
            {rooms.length > 0 ? (
                <div className="room-grid">
                    {rooms.map(room => (
                        <RoomCard key={room.id} room={room}/>
                    ))}
                </div>
            ) : (
                <p>Наразі немає доступних номерів</p>
            )}
        </div>
    );
};

export default Rooms;