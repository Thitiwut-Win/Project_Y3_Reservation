import apiClient from "@/utils/apiClient";
import { Event } from "@/types/Event";

export const getEvent = async (id: string) => {
    const res = await apiClient.get<Event>(`/api/events/${id}`);
    return res.data;
};

export const getAllEvents = async () => {
    const res = await apiClient.get<Event[]>(`/api/events`);
    return res.data;
};

export const createEvent = async (name: string, description: string, venue: string, category: string,
    datetime: string, availableSeats: number, totalSeats: number, price: number, token: string) => {
    const res = await apiClient.post(`/api/events`,
        { name, description, venue, category, datetime, availableSeats, totalSeats, price },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
};