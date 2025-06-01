import React, { useEffect, useState } from "react";
import { fetchRooms } from "../api/api";
import RoomCard from "../components/RoomCard";
import "../styles/RoomCard.css";

const availableAmenities = [
    "WiFi", "Телевізор", "Кондиціонер", "Мінібар", "Сейф",
    "Балкон", "Фен", "Рушники", "Кавоварка"
];

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);

    const [sortOrder, setSortOrder] = useState("");
    const [guestCount, setGuestCount] = useState("");
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchRooms().then(response => {
            setRooms(response.data);
            setFilteredRooms(response.data);
        });
    }, []);

    useEffect(() => {
        let filtered = [...rooms];

        if (guestCount) {
            filtered = filtered.filter(room => room.guestCapacity >= parseInt(guestCount));
        }

        if (selectedAmenities.length > 0) {
            filtered = filtered.filter(room =>
                selectedAmenities.every(a => room.amenities?.includes(a))
            );
        }

        if (sortOrder === "asc") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "desc") {
            filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredRooms(filtered);
    }, [rooms, sortOrder, guestCount, selectedAmenities]);

    const handleAmenityChange = (amenity) => {
        if (selectedAmenities.includes(amenity)) {
            setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
        } else {
            setSelectedAmenities([...selectedAmenities, amenity]);
        }
    };

    return (
        <div className="rooms-container">

            <h1>Доступні номери</h1>

            <button onClick={() => setShowFilters(!showFilters)} className="toggle-filters-btn">
                {showFilters ? "Сховати фільтри" : "Показати фільтри"}
            </button>

            {showFilters && (
                <div className="filters">
                    <div className="filter-row">
                        <label>Сортувати за ціною:</label>
                        <select
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value)}
                        >
                            <option value="">Не сортувати</option>
                            <option value="asc">Зростання</option>
                            <option value="desc">Спадання</option>
                        </select>
                    </div>

                    <div className="filter-row">
                        <label>Мінімальна кількість гостей:</label>
                        <input
                            type="number"
                            min="1"
                            value={guestCount}
                            onChange={e => setGuestCount(e.target.value)}
                        />
                    </div>

                    <div className="filter-row" style={{flex: "1 1 100%"}}>
                        <label>Зручності:</label>
                        <div className="amenities-checkboxes">
                            {availableAmenities.map(amenity => (
                                <label key={amenity}>
                                    <input
                                        type="checkbox"
                                        checked={selectedAmenities.includes(amenity)}
                                        onChange={() => handleAmenityChange(amenity)}
                                    />
                                    {amenity}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}


            <hr/>

            {filteredRooms.length > 0 ? (
                <div className="room-grid">
                    {filteredRooms.map(room => (
                        <RoomCard key={room.id} room={room}/>
                    ))}
                </div>
            ) : (
                <p>Наразі немає номерів за вибраними фільтрами</p>
            )}
        </div>
    );
};

export default Rooms;
