"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getEvent } from "@/services/eventService";
import { reserveTickets } from "@/services/ticketService";
import { Event as EventType } from "@/types/Event";
import { useSession } from "next-auth/react";
import { getPayment, getPaymentStatus } from "@/services/paymentService";
import { LinearProgress } from "@mui/material";

export default function PaymentPage() {
    const { data: session, status } = useSession();
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [event, setEvent] = useState<EventType | null>(null);
    const [loading, setLoading] = useState(true);
    const [qrImage, setQrImage] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [reserving, setReserving] = useState<boolean>(false);
    const [eventId, setEventId] = useState<string>("");
    const [seats, setSeats] = useState<number>(1);
    const [paid, setPaid] = useState(false);

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            router.replace("/authen/login");
            toast.warning("Please login first.");
            return;
        }
    }, [session, router, status]);

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                if (!id) return;

                const token = session?.user.token;
                if (!token) return;

                const data = await getPayment(id, token);
                console.log("payment loaded", data);

                setEventId(data.eventId);
                setSeats(Number(data.seats) || 1);
                setQrImage(data.qrString);
            } catch {
                toast.error("Failed to load payment details.");
            }
        };
        fetchPayment();
    }, [id, status, session]);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!eventId) return;

            try {
                const data = await getEvent(eventId);
                setEvent(data);

                const start = 0;
                const end = data.price * seats;
                const duration = 600;
                let startTime: number | null = null;

                function step(ts: number) {
                    if (!startTime) startTime = ts;
                    const elapsed = ts - startTime;
                    const t = Math.min(1, elapsed / duration);
                    const current = Math.round(start + (end - start) * t);
                    setAmount(current);
                    if (t < 1) requestAnimationFrame(step);
                }

                requestAnimationFrame(step);
            } catch {
                toast.error("Failed to load event details.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [eventId, seats]);

    useEffect(() => {
        console.log("t");
        const handleReserve = async () => {
            console.log("Handling");
            if (!event) return;

            if (seats < 1) {
                toast.warning("Please select at least one seat.");
                return;
            }

            setReserving(true);
            console.log("Reserving")
            try {
                const token = session?.user.token;
                if (!token) return;
                const res = (await reserveTickets(event._id, seats, token)) as {
                    success: boolean;
                    tickets: { _id: string; status: string }[];
                };

                if (res.success) {
                    toast.success(`Reserved ${res.tickets.length} ticket(s) successfully!`);
                    router.push("/tickets");
                }
            } catch (err: unknown) {
                toast.error("Reservation failed.");
            } finally {
                setReserving(false);
            }
        };
        if (!id || paid) return;
        console.log("test");
        let stopped = false;
        let timeoutId: NodeJS.Timeout;
        const poll = async () => {
            if (stopped) return;
            try {
                const token = session?.user.token;
                if (!token) return;

                const data = await getPaymentStatus(id, token);
                console.log(data);
                if (data.status === "paid") {
                    console.log("paid");
                    stopped = true;
                    setPaid(true);
                    toast.success("Payment confirmed!");
                    await handleReserve();
                    return;
                }

                timeoutId = setTimeout(poll, 3000);
            } catch (err) {
                console.error("Polling error", err);
                timeoutId = setTimeout(poll, 6000);
            }
        };
        poll();
        return () => {
            stopped = true;
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [id, session, status]);

    const handleCompletePayment = async () => {

    }

    if (loading) {
        return (
            <div>
                <p className="p-6 animate-pulse text-gray-600 dark:text-gray-300">
                    Loading payment details . . .
                </p>
                <LinearProgress />
            </div>
        );
    }
    else if (!event) return <p className="p-6 text-red-500">Event not found.</p>;

    return (
        <main className="relative min-h-screen p-6 mt-16 flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">

            {/* FLOATING BACKGROUND BLOBS */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute w-80 h-80 bg-amber-300/20 dark:bg-blue-500/20 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
                <div className="absolute w-96 h-96 bg-yellow-400/20 dark:bg-indigo-500/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
            </div>

            {/* PAGE TITLE */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold mb-6 text-center"
            >
                Payment for{" "}
                <span className="text-amber-600 dark:text-blue-400">
                    {event.name}
                </span>
            </motion.h1>

            {/* PAYMENT CARD */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative z-10 bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-2xl p-8 w-full max-w-lg text-center"
            >
                {/* Event info */}
                <p className="text-lg font-semibold">{event.venue}</p>
                <p className="text-sm mb-3 text-gray-600 dark:text-gray-300">
                    {new Date(event.date).toLocaleString()}
                </p>

                {/* Price summary */}
                <div className="my-3 text-xl font-bold">
                    {seats} × {event.price} ฿
                    <span className="block text-amber-600 dark:text-blue-400 text-3xl mt-1">
                        {amount.toLocaleString()} ฿
                    </span>
                </div>

                {/* QR NOT GENERATED */}
                {!qrImage && (<button className={`mt-4 w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-white 
                transition shadow-lg bg-amber-400 dark:bg-blue-400 cursor-not-allowed`}
                >
                    <div className="w-5 h-5 border-2 border-white/50 border-t-white dark:border-t-gray-200 animate-spin rounded-full"></div>
                    {"Generating QR . . . "}
                </button>)}

                {/* QR GENERATED */}
                {qrImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4"
                    >
                        <img
                            src={qrImage}
                            alt="Payment QR"
                            className="mx-auto my-4 w-56 h-56 rounded-lg shadow-md"
                        />

                        <p className="text-md text-gray-500 dark:text-gray-400 mt-6 mb-4">
                            Scan with SCB EasySandbox only.
                        </p>

                        <button
                            onClick={handleCompletePayment}
                            disabled={reserving}
                            className={`w-full py-3 rounded-xl font-semibold text-white transition shadow-lg ${reserving
                                ? "bg-amber-400 dark:bg-blue-400"
                                : "bg-amber-600 hover:bg-amber-700 dark:bg-blue-600 dark:hover:bg-indigo-600"
                                }`}
                        >
                            {reserving ? "Reserving..." : "Complete Reservation"}
                        </button>
                        <p className="text-md text-gray-500 dark:text-gray-400 mt-4 mb-6">
                            Wait for confirmation. If you do not have the app, you can press complete.
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </main>
    );
}
