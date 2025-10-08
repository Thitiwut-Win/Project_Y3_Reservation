import axios from "axios";

export const createPayment = async (
    eventId: string,
    amount: number,
    seats: number,
    token: string
) => {
    const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/create`,
        { eventId, amount, seats },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
};

// export const getPaymentStatus = async (paymentId: string) => {
//     const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/payments/${paymentId}`
//     );
//     return res.data; // { status: "pending" | "paid" | "failed" }
// };
