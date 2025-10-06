"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/events`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));
  }, [apiUrl]);

  return (
    <main className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{event.name}</h2>
            <p className="text-sm text-gray-900 dark:text-gray-100 mb-1">
              {event.venue} — {new Date(event.date).toLocaleString()}
            </p>
            <p className="text-sm text-gray-900 dark:text-gray-100 mb-1">{event.availableSeats} seats available</p>
            <Link
              href={`/events/${event._id}`}
              className="text-blue-600 underline"
            >
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
