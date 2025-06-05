import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RoomCard.css";

const RoomCard = ({ room }) => {
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;
    const navigate = useNavigate();

    const mainImage = room.images?.[0];
    const otherImages = room.images?.slice(1) || [];

    const handleNavigate = () => {
        navigate(`/rooms/${room.id}`);
    };

    return (
        <div className="room-card">
            {/* Обгортка для клікабельності і назви, і картинки */}
            <div onClick={handleNavigate} style={{ cursor: "pointer" }}>
                <h3>{room.roomName}</h3>
                {mainImage && (
                    <img
                        className="room-main-image"
                        src={`http://localhost:8080${mainImage.imageUrl}`}
                        alt="Main room view"
                    />
                )}
            </div>

            <p>Ціна: {room.price} грн</p>

            {isAuthenticated ? (
                <div>
                    <button onClick={() => navigate(`/booking/${room.id}`)}>
                        Перейти до бронювання
                    </button>
                </div>
            ) : (
                <p style={{ marginTop: "10px", color: "red" }}>
                    Щоб забронювати номер,{" "}
                    <span
                        style={{ cursor: "pointer", textDecoration: "underline" }}
                        onClick={() => navigate("/login")}
                    >
                        авторизуйтеся
                    </span>.
                </p>
            )}
        </div>
    );
};

export default RoomCard;
