"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getEvent } from "@/services/eventService";
import { createPayment } from "@/services/paymentService";
import { Event as EventType } from "@/types/Event";
import axios, { AxiosError } from "axios";
import { reserveTickets } from "@/services/ticketService";

export default function PaymentPage() {
	const router = useRouter();

	const [event, setEvent] = useState<EventType | null>(null);
	const [loading, setLoading] = useState(true);
	const [qrImage, setQrImage] = useState<string>("");
	const [amount, setAmount] = useState<number>(0);
	const [reserving, setReserving] = useState<boolean>(false);
	const [eventId, setEventId] = useState<string>("");
	const [seats, setSeats] = useState<number>(1);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		setEventId(params.get("eventId") || "");
		setSeats(Number(params.get("seats")) || 1);
	}, []);

	useEffect(() => {
		const fetchEvent = async () => {
			if (!eventId) return;
			try {
				const data = await getEvent(eventId);
				setEvent(data);
				setAmount(data.price * seats);
			} catch {
				toast.error("Failed to load event details.");
			} finally {
				setLoading(false);
			}
		};
		fetchEvent();
	}, [eventId, seats]);

	const handleGeneratePayment = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			toast.warning("Please log in first.");
			return;
		}

		try {
			const data = await createPayment(eventId, amount, seats, token);
			setQrImage(data.qrImage);
			toast.success("Payment QR generated! Scan it with PromptPay.");
		} catch (err) {
			console.error(err);
			toast.error("Failed to create payment.");
		}
	};

	const handleReserve = async () => {
		if (!event) return;

		const token = localStorage.getItem("token");
		if (!token) {
			toast.warning("You must be logged in to reserve tickets.");
			return;
		}

		if (seats < 1) {
			toast.warning("Please select at least one seat.");
			return;
		}

		setReserving(true);
		try {
			const res = (await reserveTickets(event._id, seats)) as {
				success: boolean;
				tickets: { _id: string; status: string }[];
			};

			if (res.success) {
				toast.success(`Reserved ${res.tickets.length} ticket(s) successfully!`);
				setEvent({
					...event,
					availableSeats: event.availableSeats - res.tickets.length,
				});
			}
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				const axiosErr = err as AxiosError<{ message?: string }>;
				toast.error(axiosErr.response?.data?.message || "Reservation failed.");
			} else {
				toast.error("Reservation failed.");
			}
		} finally {
			setReserving(false);
		}
		router.push("/tickets");
	};

	if (loading) return <p className="p-6">Loading...</p>;
	if (!event) return <p className="p-6 text-red-500">Event not found.</p>;

	return (
		<main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 flex flex-col items-center">
			<h1 className="text-3xl font-bold mb-4">Payment for {event.name}</h1>
			<div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-center border border-gray-300 dark:border-gray-700">
				<p>{event.venue}</p>
				<p>{new Date(event.date).toLocaleString()}</p>
				<p className="mt-2 font-semibold">
					{seats} x {event.price} ฿ ={" "}
					<span className="text-amber-500 dark:text-blue-400">{amount} ฿</span>
				</p>

				{!qrImage ? (
					<button
						onClick={handleGeneratePayment}
						className="mt-4 bg-amber-500 hover:bg-amber-600 dark:bg-blue-600 dark:hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition font-semibold"
					>
						Generate Payment QR
					</button>
				) : (
					<>
						<img src={qrImage} alt="PromptPay QR" className="mx-auto my-4 w-56 h-56" />
						<p className="text-sm text-gray-500 dark:text-gray-300">
							Scan this QR to pay {amount} ฿ via PromptPay
						</p>
						<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
							No need to pay, this is a demo. You can click Reserve below.
						</p>
						<button
							onClick={handleReserve}
							disabled={reserving}
							className={`${reserving ? "bg-yellow-400 dark:bg-blue-400" : "bg-yellow-600 hover:bg-amber-600 dark:bg-blue-600 dark:hover:bg-indigo-600"
								} text-white px-4 py-2 rounded transition m-2`}
						>
							{reserving ? "Reserving..." : "Reserve"}
						</button>
					</>
				)}
			</div>
		</main>
	);
}
