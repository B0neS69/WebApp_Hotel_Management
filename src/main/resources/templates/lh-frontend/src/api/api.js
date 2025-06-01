import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export const fetchRooms = async () => {
    return axios.get(`${API_URL}/rooms`);
};

export const fetchRoomById = async (id) => {
    return axios.get(`${API_URL}/rooms/${id}`);
};

export const createBooking = async (bookingData) => {
    return axios.post(`${API_URL}/bookings`, bookingData);
};
