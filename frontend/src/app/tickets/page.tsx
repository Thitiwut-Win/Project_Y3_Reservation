"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TicketsPage() {
	const [tickets, setTickets] = useState<any[]>([]);
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) return;
		axios
			.get(`${apiUrl}/api/tickets/me`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => setTickets(res.data.tickets));
	}, []);

	return (
		<main className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
			<h1 className="text-2xl font-bold mb-4">My Tickets</h1>
			{tickets.length === 0 ? (
				<p>No tickets reserved yet.</p>
			) : (
				<ul className="space-y-4">
					{tickets.map((ticket) => (
						<li key={ticket._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
							<p><strong>{ticket.event.name}</strong></p>
							<p>Date: {new Date(ticket.event.date).toLocaleString()}</p>
							<p>Status: {ticket.canceled ? "Canceled" : "Active"}</p>
						</li>
					))}
				</ul>
			)}
		</main>
	);
}
