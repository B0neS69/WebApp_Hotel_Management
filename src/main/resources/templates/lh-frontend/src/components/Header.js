import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css"; // ✅ імпортуємо стилі

const Header = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <header className="header">
            <nav className="nav-links">
                <Link to="/">Головна</Link>
                <Link to="/rooms">Номери</Link>

                {role === "ADMIN" && (
                    <>

                        <Link to="/adminadd">Панель адміністратора</Link>
                        <Link to="/admin/statistics">Статистика</Link>
                        <Link to="/admin/bookings">Бронювання</Link>
                        <Link to="/account">Мій акаунт</Link>
                    </>
                )}

                {role === "USER" && <Link to="/account">Мої бронювання</Link>}

                {!username && (
                    <>
                        <Link to="/register">Реєстрація</Link>
                        <Link to="/login">Увійти</Link>
                    </>
                )}
            </nav>

            <div className="user-info">
                {username && (
                    <>
                        <p>👋 Вітаю, <strong>{username}</strong> ({email})</p>
                        <button className="logout-button" onClick={handleLogout}>
                            Вийти
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
