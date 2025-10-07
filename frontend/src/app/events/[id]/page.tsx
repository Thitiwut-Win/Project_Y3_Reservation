"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getEvent } from "@/services/eventService";
import { reserveTickets } from "@/services/ticketService";
import { toast } from "sonner";
import { Event as EventType } from "@/types/Event";

export default function EventPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventType | null>(null);
  const [seats, setSeats] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [reserving, setReserving] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEvent(id);
        setEvent(data);
      } catch (err) {
        toast.error("Failed to load event details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

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
      const res = await reserveTickets(event._id, seats);
      if (res.success) {
        toast.success(`Reserved ${res.tickets.length} ticket(s) successfully!`);
        setEvent({
          ...event,
          availableSeats: event.availableSeats - res.tickets.length,
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Reservation failed.");
    } finally {
      setReserving(false);
    }

  };

  if (loading) return <p className="p-6">Loading event details...</p>;

  if (!event) return <p className="p-6 text-red-500">Event not found.</p>;

  return (<main className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen"> <h1 className="text-2xl font-bold mb-2">{event.name}</h1> <p className="text-gray-600 mb-1">{event.venue}</p> <p className="mb-2">{new Date(event.date).toLocaleString()}</p> <p className="font-medium mb-4">{event.availableSeats} seats left</p>

    < div className="flex items-center gap-2" >
      <label htmlFor="seats" className="font-medium">
        Seats:
      </label>
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
        disabled={reserving}
        className={`${reserving ? "bg-yellow-400 dark:bg-blue-400" : "bg-yellow-600 hover:bg-amber-600 dark:bg-blue-600 dark:hover:bg-indigo-600"
          } text-white px-4 py-2 rounded transition`}
      >
        {reserving ? "Reserving..." : "Reserve"}
      </button>
    </div >
  </main >

  );
}
