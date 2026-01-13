import apiClient from "@/utils/apiClient";
import { Ticket } from "@/types/Ticket";

export const reserveTickets = async (eventId: string, seats: number, token: string) => {
    const res = await apiClient.post(`/api/tickets/reserve/${eventId}`, { seats },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
};

export const cancelTicket = async (ticketId: string, token: string) => {
    const res = await apiClient.delete(`/api/tickets/${ticketId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
};

export const getMyTickets = async (token: string) => {
    const res = await apiClient.get<{ tickets: Ticket[] }>(`/api/tickets/me`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
};
