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
            .then(res => {
                // Фільтрація відгуків із рейтингом 4 або 5
                const filtered = res.data.filter(r => r.rating >= 4);
                setTopReviews(filtered);
            })
            .catch(err => console.error("Помилка при завантаженні відгуків:", err));
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };

    return (
        <div className="home-container">
            <h1>Ласкаво просимо в LuxHost!</h1>
            <p className="p-container">Забронюйте найкращі номери за доступними цінами.</p>
            <Link to="/rooms" className="btn">Переглянути номери</Link>

            {/* Топ кімнати */}

            <div className="section-box">
                <h2>🏆 Наші перлини</h2>
                <Slider
                    {...sliderSettings}
                    autoplay={true}
                    autoplaySpeed={3000}
                    pauseOnHover={true}
                >
                    {topRooms.map(room => (
                        <div key={room.id} className="carousel-div">
                            <Link to={`/rooms/${room.id}`} className="carousel-slide">
                                <h3>{room.type}</h3>
                                {room.images && room.images.length > 0 && (
                                    <img
                                        src={`http://localhost:8080${room.images[0].imageUrl}`}
                                        alt={room.type}
                                        style={{
                                            width: "100%",
                                            height: "380px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                )}
                                <p style={{fontWeight: "bold", marginTop: "10px"}}>{room.price} грн/доба</p>
                            </Link>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* Відгуки */}
            <h1 style={{ marginTop: "40px" }}>🌟 Відгуки наших клієнтів</h1>
            <div className="section-box">

                {topReviews.length > 0 ? (
                    <div className="reviews-marquee">
                        <div className="reviews-track">
                            {[...topReviews, ...topReviews].map((review, i) => (
                                <div key={i} className="review-card moving">
                                    <strong>{review.authorName}</strong><br />
                                    Рейтинг: {review.rating}/5<br />
                                    {review.comment}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>Немає відгуків з рейтингом 4-5.</p>
                )}
            </div>

        </div>
    );
};

export default Home;
