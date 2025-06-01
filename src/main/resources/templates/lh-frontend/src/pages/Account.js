import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/Account.css';

function Account() {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [formData, setFormData] = useState({ firstName: "", lastName: "", phone: "" });
    const [adminForm, setAdminForm] = useState({ username: "", email: "", password: "" });

    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!email || !token) return;
        axios.get(`http://localhost:8080/api/users/${email}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            setUser(res.data);
            setFormData({
                firstName: res.data.firstName || "",
                lastName: res.data.lastName || "",
                phone: res.data.phone || ""
            });
        });
    }, [email, token]);

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordChange = (e) => {
        setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:8080/api/users/update-profile`, {
                email,
                ...formData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Дані оновлено успішно!");
            setEditMode(false);
        } catch (err) {
            alert("Помилка оновлення даних");
        }
    };

    const handlePasswordUpdate = async () => {
        const { oldPassword, newPassword, confirmPassword } = passwordData;
        if (newPassword !== confirmPassword) {
            alert("Нові паролі не співпадають.");
            return;
        }

        try {
            await axios.put(`http://localhost:8080/api/users/change-password`, {
                email,
                oldPassword,
                newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Пароль змінено успішно!");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            alert("Не вдалося змінити пароль");
        }
    };

    const handleAdminCreate = async () => {
        try {
            const response = await axios.post("http://localhost:8080/admin/create-admin", adminForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(response.data || "Адміністратор створений!");
            setAdminForm({ username: "", email: "", password: "" });
        } catch (err) {
            alert("Помилка створення адміністратора.");
        }
    };

    if (!user) return <div>Завантаження...</div>;

    return (
        <div className="account-container">
            <h2>Профіль користувача</h2>
            <p><strong>Логін:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Роль:</strong> {user.role}</p>

            {user.role !== "ADMIN" && (
                editMode ? (
                    <>
                        <div>
                            <label>Ім'я:</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Прізвище:</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                        </div>
                        <div>
                            <label>Телефон:</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
                        </div>
                        <button onClick={handleSave}>💾 Зберегти зміни</button>
                        <button onClick={() => setEditMode(false)}>❌ Скасувати</button>
                    </>
                ) : (
                    <>
                        <p><strong>Ім'я:</strong> {user.firstName || "-"}</p>
                        <p><strong>Прізвище:</strong> {user.lastName || "-"}</p>
                        <p><strong>Телефон:</strong> {user.phone || "-"}</p>
                        <button onClick={() => setEditMode(true)}>✏️ Редагувати</button>
                    </>
                )
            )}

            <hr />

            <h3>🔐 Змінити пароль</h3>
            <div className="password-section">
                <input
                    type="password"
                    name="oldPassword"
                    placeholder="Старий пароль"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                />
            </div>
            <div className="password-section">
                <input
                    type="password"
                    name="newPassword"
                    placeholder="Новий пароль"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                />
            </div>
            <div className="password-section">
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Підтвердіть новий пароль"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                />
            </div>
            <button onClick={handlePasswordUpdate}>🔄 Змінити пароль</button>

            <hr />
            {user.role !== "ADMIN" && (
                <button onClick={() => navigate("/my-bookings")}>📋 Переглянути мої бронювання</button>
            )}

            {user.role === "ADMIN" && (
                <>
                    <hr />
                    <h3>👤 Додати адміністратора</h3>
                    <div>
                        <input
                            type="text"
                            placeholder="Ім'я користувача"
                            value={adminForm.username}
                            onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={adminForm.email}
                            onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={adminForm.password}
                            onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                        />
                    </div>
                    <button onClick={handleAdminCreate}>➕ Створити адміністратора</button>
                </>
            )}
        </div>
    );
}

export default Account;
