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
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/rooms/${roomId}`).then(res => setRoom(res.data));
        axios.get(`http://localhost:8080/api/reviews/room/${roomId}`).then(res => setReviews(res.data));

        if (isAuthenticated) {
            const userEmail = localStorage.getItem("email"); // переконайся, що при логіні ти зберігаєш email в localStorage
            if (userEmail) {
                axios.get(`http://localhost:8080/api/users/${userEmail}`)
                    .then(res => {
                        if (res.data?.firstName || res.data?.lastName) {
                            setCurrentUser(res.data);
                            setNewReview(prev => ({
                                ...prev,
                                authorName: `${res.data.firstName || ""} ${res.data.lastName || ""}`.trim()
                            }));
                        }
                    })
                    .catch(err => console.error("Не вдалося отримати користувача:", err));
            }
        }
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

            <div className="top-section">
                <div className="gallery-column">
                    <ImageGallery images={room.images}/>
                </div>

                <div className="info-column">
                    <h2>{room.roomName} ({room.roomNumber})</h2>
                    <p><strong>Тип:</strong> {room.type}</p>
                    <p><strong>Ціна:</strong> {room.price} грн</p>
                    <p><strong>Кількість гостей:</strong> {room.guestCapacity}</p>

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
                            >авторизуйтеся</span>.
                        </p>
                    )}
                </div>
            </div>

            <div className="bottom-section">
                <div class="room-description">
                    <h3>Опис:</h3>
                    <p>{room.description}</p>
                </div>

                <div class="room-features">
                    <h3>Зручності:</h3>
                    {room.amenities?.length > 0 ? (
                        <ul>{room.amenities.map((a, i) => <li key={i}>{a}</li>)}</ul>
                    ) : <p>Зручності не вказано.</p>}
                </div>

                <div class="room-meals">
                    <h3>Харчування:</h3>
                    <p>{room.includesMeal ? "Надається харчування" : "Харчування не надається"}</p>
                </div>



                <h3>Залишити відгук:</h3>
                {isAuthenticated ? (
                    <form onSubmit={handleReviewSubmit} className="review-form">
                        <input
                            type="text"
                            placeholder="Ваше ім'я"
                            value={newReview.authorName}
                            onChange={e => setNewReview({...newReview, authorName: e.target.value})}
                            required
                        />
                        <textarea
                            placeholder="Ваш відгук"
                            value={newReview.comment}
                            onChange={e => setNewReview({...newReview, comment: e.target.value})}
                            required
                        />
                        <label>Оцінка: </label>
                        <input
                            type="number"
                            min="1" max="5"
                            value={newReview.rating}
                            onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                        />
                        <button type="submit">Надіслати</button>
                    </form>
                ) : (
                    <p style={{color: "red"}}>
                        Щоб залишити відгук,{" "}
                        <span
                            style={{cursor: "pointer", textDecoration: "underline"}}
                            onClick={() => navigate("/login")}
                        >авторизуйтеся</span>.
                    </p>
                )}

                <div className="room-reviews">
                    <h3>Відгуки:</h3>
                    {reviews.length === 0 ? (
                        <p>Немає відгуків.</p>
                    ) : (
                        <div className="reviews-list">
                            {reviews.map(r => (
                                <div className="review-card" key={r.id}>
                                    <div className="review-header">
                                        <span className="review-rating">{r.rating}/5</span>
                                        <strong className="review-author">{r.authorName}</strong>
                                    </div>
                                    <p className="review-comment">{r.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


            </div>
        </div>

    );

};

export default RoomDetailsPage;
