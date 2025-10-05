"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function Event() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [seats, setSeats] = useState<number>(1);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error("Error fetching event:", err));
  }, [id]);

  const handleReserve = async (seats: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to reserve tickets.");
        return;
      }

      const res = await axios.post(
        `${apiUrl}/api/tickets/reserve/${id}`,
        { seats },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert(
          `Reservation successful! Reserved ${res.data.tickets.length} ticket(s).`
        );
      } else {
        alert("Reservation failed.");
      }
    } catch (err: any) {
      if (err.response) {
        alert(err.response.data.message || "Reservation failed");
      } else {
        alert("Reservation failed. Check your network.");
      }
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">{event.name}</h1>
      <p>{event.venue}</p>
      <p>{new Date(event.date).toLocaleString()}</p>
      <p>{event.availableSeats} seats left</p>

      <div className="mt-4 flex items-center gap-2">
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
          onClick={() => handleReserve(seats)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Reserve
        </button>
      </div>
    </main>
  );
}
