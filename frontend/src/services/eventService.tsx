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
