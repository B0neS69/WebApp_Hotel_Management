import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("username", data.username);
            localStorage.setItem("email", data.email);
            const token = localStorage.getItem("token");
            console.log("Token in AdminPanel:", token);

            alert("Вхід успішний!");

            // 🔁 Перенаправлення в залежності від ролі
            if (data.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/account");
            }
        } else {
            alert("Невірний логін або пароль!");
        }
    };

    return (
        <div className="auth-container">
            <h2>Вхід</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username" value={username}
                       onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" placeholder="Password" value={password}
                       onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">Увійти</button>
            </form>
        </div>
    );
}

export default Login;
