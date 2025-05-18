import { useState } from "react";
import "../styles/Auth.css";
function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState(""); // Додали email
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }), // Передаємо email
                credentials: "include", // Додаємо підтримку CORS із куками
            });

            if (response.ok) {
                alert("Реєстрація успішна!");
            } else {
                const errorMessage = await response.text();
                alert("Помилка реєстрації! " + errorMessage);
            }
        } catch (error) {
            console.error("Помилка:", error);
            alert("Не вдалося підключитися до сервера.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Реєстрація</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Зареєструватися</button>
            </form>
        </div>
    );
}

export default Register;
