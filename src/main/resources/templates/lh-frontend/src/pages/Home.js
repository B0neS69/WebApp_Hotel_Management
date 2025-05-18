import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Home.css";

const Home = () => {
    const [topRooms, setTopRooms] = useState([]);
    const [topReviews, setTopReviews] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/rooms/top3-expensive")
            .then(res => setTopRooms(res.data))
            .catch(err => console.error("Помилка при завантаженні номерів:", err));

        axios.get("http://localhost:8080/api/reviews/top-rated")
            .then(res => setTopReviews(res.data))
            .catch(err => console.error("Помилка при завантаженні відгуків:", err));
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div className="home-container">
            <h1>Ласкаво просимо в LuxHost!</h1>
            <p>Забронюйте найкращі номери за доступними цінами.</p>
            <Link to="/rooms" className="btn">Переглянути номери</Link>

            <h2 style={{ marginTop: "40px" }}>🏆 Найдорожчі номери</h2>
            <Slider {...sliderSettings}>
                {topRooms.map(room => (
                    <div key={room.id}>
                        <h3>{room.type}</h3>
                        {room.images && room.images.length > 0 && (
                            <img
                                src={`http://localhost:8080${room.images[0].imageUrl}`}
                                alt={room.type}
                                style={{ width: "100%", height: "400px", objectFit: "cover" }}
                            />
                        )}
                        <p style={{ fontWeight: "bold" }}>{room.price} грн/доба</p>
                    </div>
                ))}
            </Slider>

            <h2 style={{ marginTop: "40px" }}>🌟 Відгуки з високим рейтингом</h2>
            {topReviews.length > 0 ? (
                topReviews.map((review, i) => (
                    <div key={i} className="review-card">
                        <strong>Користувач:</strong> {review.authorName} <br />
                        <strong>Рейтинг:</strong> {review.rating}/5 <br />
                        <strong>Відгук:</strong> {review.comment}
                    </div>
                ))
            ) : (
                <p>Немає відгуків з рейтингом 4-5.</p>
            )}
        </div>
    );
};

export default Home;
