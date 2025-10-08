"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEvent } from "@/services/eventService";
import { Event as EventType } from "@/types/Event";
import { toast } from "sonner";

export default function EventPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventType | null>(null);
  const [seats, setSeats] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEvent(id);
        setEvent(data);
      } catch {
        toast.error("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleReserve = () => {
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

    router.push(`/payment?eventId=${event._id}&seats=${seats}`);
  };

  if (loading) return <p className="p-6">Loading event details...</p>;
  if (!event) return <p className="p-6 text-red-500">Event not found.</p>;

  return (
    <main className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen ml-4">
      <h1 className="text-2xl font-bold mb-1">{event.name}</h1>
      <p className="mb-2">{event.description}</p>
      <p className="mb-1">{event.venue}</p>
      <p className="mb-2">{new Date(event.date).toLocaleString()}</p>
      <p className="font-medium mb-1">{event.availableSeats} seats left</p>
      <p className="font-medium mb-4">{event.price} ฿/ticket</p>
      <p className="my-2">Total Price: {seats * event.price}</p>

      <div className="flex items-center gap-2">
        <label htmlFor="seats" className="font-medium">Seats:</label>
        <input
          id="seats"
          type="number"
          min={1}
          max={event.availableSeats}
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="border px-2 py-1 rounded w-16"
        />
        <button
          onClick={handleReserve}
          className="bg-yellow-600 hover:bg-amber-600 dark:bg-blue-600 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded transition"
        >
          Reserve
        </button>
      </div>
    </main>
  );
}
