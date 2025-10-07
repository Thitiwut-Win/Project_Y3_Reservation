import apiClient from "@/utils/apiClient";
import { Ticket } from "@/types/Ticket";

export const reserveTickets = async (eventId: string, seats: number) => {
    const res = await apiClient.post(`/api/tickets/reserve/${eventId}`, { seats });
    return res.data;
};

export const cancelTicket = async (ticketId: string) => {
    const res = await apiClient.delete(`/api/tickets/${ticketId}`);
    return res.data;
};

export const getMyTickets = async () => {
    const res = await apiClient.get<{ tickets: Ticket[] }>(`/api/tickets/me`);
    return res.data;
};
