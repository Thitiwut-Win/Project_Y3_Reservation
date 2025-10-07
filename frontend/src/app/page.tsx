"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTES } from "@/utils/apiRoutes";

export default function HomePage() {
	const [events, setEvents] = useState<any[]>([]);

	useEffect(() => {
		axios
			.get(API_ROUTES.events)
			.then((res) => setEvents(res.data))
			.catch((err) => console.error("Error fetching events:", err));
	}, []);

	return (
		<main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

			<section className="px-8 py-16 text-center bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 text-white 
			border border-black ring ring-2 dark:from-indigo-400 dark:via-blue-600 dark:to-indigo-400">
				<h2 className="text-4xl font-bold mb-4">
					Discover & Reserve Your Next Event
				</h2>
				<p className="text-lg mb-6">
					Browse upcoming events, reserve tickets, and manage your reservations
					with ease.
				</p>
				<Link
					href="/events"
					className="bg-white text-amber-500 dark:text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100"
				>
					View Events
				</Link>
			</section>

			<section className="px-8 py-12">
				<h3 className="text-2xl font-semibold mb-6">Upcoming Events</h3>
				{events.length === 0 ? (
					<p className="text-gray-900 dark:text-gray-100">No events available right now.</p>
				) : (
					<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{events.slice(0, 3).map((event) => (
							<li
								key={event._id}
								className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition"
							>
								<h4 className="text-lg font-bold mb-2">{event.name}</h4>
								<p className="text-sm text-gray-900 dark:text-gray-100 mb-1">
									{event.venue}
								</p>
								<p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
									{new Date(event.date).toLocaleString()}
								</p>
								<p className="text-sm mb-4">
									{event.availableSeats} seats available
								</p>
								<Link
									href={`/events/${event._id}`}
									className="flex ease-in-out items-center text-yellow-500 dark:text-blue-400 font-semibold
									hover:translate-x-5 hover:-translate-y-0.5 hover:scale-105 transition delay-50 duration-500"
								>
									View Details →
								</Link>
							</li>
						))}
					</ul>
				)}
			</section>
		</main>
	);
}
