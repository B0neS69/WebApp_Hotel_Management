import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
 // CSS для Lightbox
import ImageGallery from "./ImageGallery";
import '../styles/RoomDetailsPage.css';
import { useNavigate } from "react-router-dom";


const RoomDetailsPage = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ authorName: "", comment: "", rating: 5 });
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;

    useEffect(() => {
        axios.get(`http://localhost:8080/api/rooms/${roomId}`).then(res => setRoom(res.data));
        axios.get(`http://localhost:8080/api/reviews/room/${roomId}`).then(res => setReviews(res.data));
    }, [roomId]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`http://localhost:8080/api/reviews`, {
            ...newReview,
            room: { id: parseInt(roomId) }
        });
        setNewReview({ authorName: "", comment: "", rating: 5 });
        const updatedReviews = await axios.get(`http://localhost:8080/api/reviews/room/${roomId}`);
        setReviews(updatedReviews.data);
    };

    if (!room) return <p>Завантаження...</p>;

    return (
        <div className="room-details">
            <h2>{room.roomName} ({room.roomNumber})</h2>
            <p>Тип: {room.type}</p>
            <p>Ціна: {room.price} грн</p>

            <h3>Опис:</h3>
            <p>{room.description}</p>
            <p>Кількість гостей: {room.guestCapacity}</p>

            <h3>Фото:</h3>
            <div className="room-gallery">
                <ImageGallery images={room.images}/>
            </div>

            <h3>Зручності:</h3>
            {room.amenities && room.amenities.length > 0 ? (
                <ul>
                    {room.amenities.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
            ) : (
                <p>Зручності не вказано.</p>
            )}

            <h3>Харчування:</h3>
            <p>{room.includesMeal ? "Надається харчування" : "Харчування не надається"}</p>
            <h3>Бронювання:</h3>
            {isAuthenticated ? (
                <button onClick={() => navigate(`/booking/${room.id}`)}>
                    Забронювати номер
                </button>
            ) : (
                <p style={{marginTop: "10px", color: "red"}}>
                    Щоб забронювати номер,{" "}
                    <span
                        style={{cursor: "pointer", textDecoration: "underline"}}
                        onClick={() => navigate("/login")}
                    >
            авторизуйтеся
        </span>.
                </p>
            )}

            <h3>Відгуки:</h3>
            {reviews.length === 0 ? <p>Немає відгуків.</p> : (
                <ul>
                    {reviews.map(r => (
                        <li key={r.id}>
                            <strong>{r.authorName}</strong> ({r.rating}/5): {r.comment}
                        </li>
                    ))}
                </ul>
            )}

            <h3>Залишити відгук:</h3>
            <form onSubmit={handleReviewSubmit} className="review-form">
                <input
                    type="text"
                    placeholder="Ваше ім'я"
                    value={newReview.authorName}
                    onChange={e => setNewReview({...newReview, authorName: e.target.value})}
                    required
                />
                <br/>
                <textarea
                    placeholder="Ваш відгук"
                    value={newReview.comment}
                    onChange={e => setNewReview({...newReview, comment: e.target.value})}
                    required
                />
                <br/>
                <label>Оцінка: </label>
                <input
                    type="number"
                    min="1" max="5"
                    value={newReview.rating}
                    onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                />
                <br/>
                <button type="submit">Надіслати</button>
            </form>
        </div>
    );
};

export default RoomDetailsPage;
