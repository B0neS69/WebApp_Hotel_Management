import { useState, useEffect } from "react";
import "../styles/Auth.css";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const checkUsername = async (value) => {
        if (!value) return;
        try {
            const res = await fetch(`http://localhost:8080/api/auth/check-username?username=${encodeURIComponent(value)}`);
            const isAvailable = await res.json();
            setUsernameError(isAvailable ? "" : "Ім’я вже зайняте. Спробуйте інше.");
        } catch (err) {
            setUsernameError("Помилка перевірки імені.");
        }
    };

    const checkEmail = async (value) => {
        if (!value) return;
        try {
            const res = await fetch(`http://localhost:8080/api/auth/check-email?email=${encodeURIComponent(value)}`);
            const isAvailable = await res.json();
            setEmailError(isAvailable ? "" : "Email вже зайнятий. Спробуйте інший.");
        } catch (err) {
            setEmailError("Помилка перевірки email.");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Очистити попередні повідомлення
        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        setSuccessMessage("");

        // Повторна перевірка перед реєстрацією
        await checkUsername(username);
        await checkEmail(email);

        if (usernameError || emailError) return;

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError("Пароль має містити щонайменше 8 символів, включаючи букви та цифри.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
                credentials: "include",
            });

            const result = await response.text();

            if (response.ok) {
                alert("Реєстрація успішна!");
                setUsername("");
                setEmail("");
                setPassword("");
            } else {
                const lowerResult = result.toLowerCase();
                if (lowerResult.includes("ім’я") || lowerResult.includes("username")) {
                    setUsernameError("Ім’я вже зайняте. Спробуйте інше.");
                } else if (lowerResult.includes("email")) {
                    setEmailError("Email вже зайнятий. Спробуйте інший.");
                } else {
                    setUsernameError(result);
                }
            }
        } catch (error) {
            setUsernameError("Сервер недоступний. Спробуйте пізніше.");
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
                    onChange={(e) => {
                        setUsername(e.target.value);
                        checkUsername(e.target.value);
                    }}
                    required
                />
                {usernameError && <div className="error-message">{usernameError}</div>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        checkEmail(e.target.value);
                    }}
                    required
                />
                {emailError && <div className="error-message">{emailError}</div>}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {passwordError && <div className="error-message">{passwordError}</div>}

                <button type="submit">Зареєструватися</button>

                {successMessage && <div className="success-message">{successMessage}</div>}
            </form>
        </div>
    );
}

export default Register;
