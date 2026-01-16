import { Payment } from "@/types/Payment";
import apiClient from "@/utils/apiClient";

export const createPayment = async (eventId: string, amount: number, seats: number, token: string) => {
    const res = await apiClient.post(
        `/api/payments/create`,
        { eventId, amount, seats },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
};

export const getPaymentStatus = async (paymentId: string, token: string) => {
    const res = await apiClient.get(`/api/payments/${paymentId}/status`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data; // { status: "pending" | "paid" | "failed" }
};

export const getPayment = async (paymentId: string, token: string) => {
    const res = await apiClient.get<Payment>(
        `/api/payments/${paymentId}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
};
