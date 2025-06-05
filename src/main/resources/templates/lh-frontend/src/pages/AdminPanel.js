import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/adminStyles.css';

export default function AdminPanel() {
    const [adminData, setAdminData] = useState({ username: '', email: '', password: '' });
    const [roomData, setRoomData] = useState({
        roomNumber: '',
        roomName: '',
        type: '',
        price: '',
        isAvailable: true,
        description: '',
        includesMeal: false,
        amenities: [],
        guestCapacity: 1
    });
    const [previewImages, setPreviewImages] = useState([]);

    const [imageFiles, setImageFiles] = useState([]);
    const [rooms, setRooms] = useState([]);
    const availableAmenities = [
        "WiFi", "Телевізор", "Кондиціонер", "Мінібар", "Сейф", "Балкон", "Фен", "Рушники", "Кавоварка"
    ];
    const [selectedRoomImages, setSelectedRoomImages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openImageModal = (images) => {
        setSelectedRoomImages(images);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRoomImages([]);
    };

    const token = localStorage.getItem("token");

    const fetchRooms = () => {
        axios.get('http://localhost:8080/admin/rooms', {
            headers: { "Authorization": `Bearer ${token}` }
        }).then(res => setRooms(res.data))
            .catch(err => console.error("Error fetching rooms:", err));
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const uploadImages = async () => {
        const formData = new FormData();
        imageFiles.forEach(file => formData.append("images", file));
        const res = await axios.post("http://localhost:8080/admin/upload-images", formData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        });
        return res.data;
    };

    const addRoom = async () => {
        try {
            let imageUrls = [];
            if (imageFiles.length > 0) {
                imageUrls = await uploadImages();
            }
            console.log("roomData being sent:", roomData);

            const roomResponse = await axios.post('http://localhost:8080/admin/rooms', roomData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const roomId = roomResponse.data.id;

            await axios.post(`http://localhost:8080/admin/rooms/${roomId}/add-images`, imageUrls, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            alert("Номер успішно створено!");
            fetchRooms();
        } catch (err) {
            console.error(err);
            alert("Error: " + (err.response?.data || err.message));
        }
    };

    const deleteRoom = (roomId) => {
        axios.delete(`http://localhost:8080/admin/rooms/${roomId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(() => {
                alert("Room deleted!");
                fetchRooms();
            })
            .catch(err => {
                console.error("Помилка при видаленні:", err);
                alert("Error: " + (err.response?.data || err.message));
            });
    };

    return (
        <div>
        <div className="admin-container">
            <h2>Додати номер</h2>
            <div className="room-form">
                <input
                    className="form-input"
                    placeholder="Номер кімнати"
                    onChange={e => setRoomData({...roomData, roomNumber: e.target.value})}
                    value={roomData.roomNumber}
                />
                <input
                    className="form-input"
                    placeholder="Назва кімнати"
                    onChange={e => setRoomData({...roomData, roomName: e.target.value})}
                    value={roomData.roomName}
                />
                <input
                    className="form-input"
                    placeholder="Тип"
                    onChange={e => setRoomData({...roomData, type: e.target.value})}
                />
                <input
                    className="form-input"
                    placeholder="Ціна"
                    type="number"
                    onChange={e => setRoomData({...roomData, price: parseFloat(e.target.value)})}
                />
                <label className="checkbox-label">
                    Вільний:
                    <input
                        type="checkbox"
                        checked={roomData.isAvailable}
                        onChange={e => setRoomData({...roomData, isAvailable: e.target.checked})}
                    />
                </label>
                <input
                    className="form-input"
                    type="number"
                    placeholder="Кількість гостей"
                    min="1"
                    onChange={e => setRoomData({...roomData, guestCapacity: parseInt(e.target.value)})}
                    value={roomData.guestCapacity}
                />

                <textarea
                    className="form-textarea"
                    placeholder="Опис номера (максимум 1000 символів)"
                    onChange={e => setRoomData({...roomData, description: e.target.value})}
                    value={roomData.description}
                    maxLength={1000}
                />

                <label className="checkbox-label">
                    Включає харчування:
                    <input
                        type="checkbox"
                        checked={roomData.includesMeal}
                        onChange={e => setRoomData({...roomData, includesMeal: e.target.checked})}
                    />
                </label>

                <label>Зручності:</label>
                <div className="checkbox-group">
                    {availableAmenities.map((amenity, index) => (
                        <label key={index}>
                            <input
                                type="checkbox"
                                checked={roomData.amenities.includes(amenity)}
                                onChange={e => {
                                    const updated = e.target.checked
                                        ? [...roomData.amenities, amenity]
                                        : roomData.amenities.filter(a => a !== amenity);
                                    setRoomData({...roomData, amenities: updated});
                                }}
                            />
                            {amenity}
                        </label>
                    ))}
                </div>

                <input
                    className="form-input"
                    type="file"
                    multiple
                    onChange={e => {
                        const files = Array.from(e.target.files);
                        setImageFiles(files);

                        // Створення попередніх переглядів
                        const previews = files.map(file => ({
                            file,
                            url: URL.createObjectURL(file)
                        }));
                        setPreviewImages(previews);
                    }}
                />
                <div className="preview-container">
                    {previewImages.map((img, index) => (
                        <div key={index} className="preview-item">
                            <img src={img.url} alt={`preview-${index}`} className="preview-image"/>
                            <button
                                className="remove-preview"
                                onClick={() => {
                                    const updatedFiles = imageFiles.filter((_, i) => i !== index);
                                    const updatedPreviews = previewImages.filter((_, i) => i !== index);

                                    setImageFiles(updatedFiles);
                                    setPreviewImages(updatedPreviews);
                                }}
                            >
                                ✖
                            </button>
                        </div>
                    ))}
                </div>

                <button className="submit-button" onClick={addRoom}>Додати номер</button>
            </div>

        </div>
            <div className="room-table">
                <h2>Список номерів</h2>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Номер кімнати</th>
                        <th>Назва кімнати</th>
                        <th>Тип</th>
                        <th>Ціна</th>
                        <th>Опис</th>
                        <th>Харчування</th>
                        <th>Зручності</th>
                        <th>Зображення</th>
                        <th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rooms.map(room => (
                        <tr key={room.id}>
                            <td>{room.id}</td>
                            <td>{room.roomNumber}</td>
                            <td>{room.roomName}</td>
                            <td>{room.type}</td>
                            <td>{room.price}</td>
                            <td>{room.description}</td>
                            <td>{room.includesMeal ? "Так" : "Ні"}</td>
                            <td>
                                <ul>
                                    {room.amenities?.map((a, i) => <li key={i}>{a}</li>)}
                                </ul>
                            </td>
                            <td>
                                {room.images?.length > 0 && (
                                    <img
                                        src={`http://localhost:8080${room.images[0].imageUrl}`}
                                        alt={`room-${room.id}-preview`}
                                        width="80"
                                        className="room-image"
                                        style={{cursor: 'pointer'}}
                                        onClick={() => openImageModal(room.images)}
                                    />
                                )}
                            </td>

                            <td>
                                <button className="delete-button" onClick={() => deleteRoom(room.id)}>🗑 Видалити
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {isModalOpen && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button className="close-button" onClick={closeModal}>✖</button>
                            <div className="modal-images">
                                {selectedRoomImages.map((img, index) => (
                                    <img
                                        key={index}
                                        src={`http://localhost:8080${img.imageUrl}`}
                                        alt={`modal-${index}`}
                                        className="modal-image"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
