"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { API_ROUTES } from "@/utils/apiRoutes";

interface Ticket {
	_id: string;
	status: string;
	event: {
		name: string;
		date: string;
	};
}

export default function TicketsPage() {
	const { data: session, status } = useSession();
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		if (status === "loading") return;

		if (status === "unauthenticated") {
			router.replace("/authen/login");
			return;
		}

		const fetchTickets = async () => {
			try {
				const token = (session?.user as any)?.backendToken;
				if (!token) {
					router.replace("/authen/login");
					return;
				}

				const res = await axios.get(`${API_ROUTES.tickets}/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setTickets(res.data.tickets);
			} catch (err) {
				console.error("Error fetching tickets:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchTickets();
	}, [status, session, router]);

	const handleCancel = async (ticketId: string) => {
		if (!confirm("Are you sure you want to cancel this ticket?")) return;
		try {
			const token = (session?.user as any)?.backendToken;
			await axios.delete(`${API_ROUTES.tickets}/${ticketId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setTickets((prev) =>
				prev.map((t) => (t._id === ticketId ? { ...t, status: "cancelled" } : t))
			);
			alert("Ticket canceled successfully!");
		} catch (err) {
			console.error(err);
			alert("Failed to cancel ticket.");
		}
	};

	if (loading) return <p className="p-6">Loading tickets...</p>;

	return (
		<main className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
			<h1 className="text-2xl font-bold mb-4">My Tickets</h1>

			{tickets.length === 0 ? (
				<p>No tickets reserved yet.</p>
			) : (
				<ul className="space-y-4">
					{tickets.map((ticket) => (
						<div
							key={ticket._id}
							className="flex flex-row bg-white dark:bg-gray-800 p-4 rounded shadow w-full"
						>
							<li className="flex-grow">
								<p><strong>{ticket.event.name}</strong></p>
								<p>Date: {new Date(ticket.event.date).toLocaleString()}</p>
								<p>Status: {ticket.status === "cancelled" ? "Cancelled" : "Active"}</p>
							</li>
							<button
								onClick={() => handleCancel(ticket._id)}
								className={`h-10 m-auto p-2 rounded-lg ${ticket.status === "cancelled"
									? "bg-gray-400 cursor-not-allowed"
									: "bg-red-500 hover:bg-red-600"
									}`}
								disabled={ticket.status === "cancelled"}
							>
								{ticket.status === "cancelled" ? "Cancelled" : "Cancel"}
							</button>
						</div>
					))}
				</ul>
			)}
		</main>
	);
}
