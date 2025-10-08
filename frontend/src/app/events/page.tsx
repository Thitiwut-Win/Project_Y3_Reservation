"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Event } from "@/types/Event";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events`);
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p className="p-6">Loading events...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <main className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold">{event.name}</h2>
            <p className="text-sm mb-1">{event.description}</p>
            <p className="text-sm mb-1">
              {event.venue} — {new Date(event.date).toLocaleString()}
            </p>
            <p className="text-sm mb-1">{event.availableSeats} seats available</p>
            <p className="text-sm mb-1">{event.price} ฿</p>
            <Link href={`/events/${event._id}`} className="text-blue-600 underline">
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
