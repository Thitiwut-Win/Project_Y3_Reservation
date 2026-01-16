"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEvent } from "@/services/eventService";
import { Event as EventType } from "@/types/Event";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { LinearProgress } from "@mui/material";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Ticket,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

export default function EventPage() {
  const { data: session, status } = useSession();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<EventType | null>(null);
  const [seats, setSeats] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!id) return;
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

    if (status === "unauthenticated") {
      toast.warning("Please login first.");
      router.replace("/authen/login");
      return;
    }

    if (seats < 1) {
      toast.warning("Please select at least one seat.");
      return;
    }

    router.push(`/payment?eventId=${event._id}&seats=${seats}`);
  };

  if (loading)
    return (
      <div className="p-6 max-w-xl mx-auto text-center space-y-4">
        <p>Loading event . . .</p>
        <LinearProgress />
      </div>
    );

  if (!event)
    return <p className="p-6 text-red-500">Event not found.</p>;

  return (
    <main className="relative min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">

      {/* Floating background animation shapes */}
      <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 rounded-full bg-lime-300/25 dark:bg-rose-500/25 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute bottom-0 left-10 w-72 h-72 rounded-full bg-purple-300/30 dark:bg-green-600/30 blur-2xl animate-bounce" />

      {/* Page container */}
      <div className="max-w-4xl mx-auto relative">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-indigo-400 transition mb-4 text-[18px]"
        >
          <ArrowLeft size={22} />
          Back
        </button>

        {/* Banner */}
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
          className="w-full h-64 object-cover rounded-xl shadow-lg"
          alt="Event banner"
        />

        {/* Event content card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-md bg-white/60 dark:bg-gray-800/40 border border-white/20 p-6 rounded-2xl shadow-xl mt-6"
        >
          <h1 className="text-3xl font-extrabold mb-4">{event.name}</h1>

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <MapPin className="text-amber-500 dark:text-indigo-500" size={20} />
              <p>{event.venue}</p>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="text-amber-500 dark:text-indigo-500" size={20} />
              <p>{new Date(event.date).toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-3">
              <Users className="text-amber-500 dark:text-indigo-500" size={20} />
              <p>{event.availableSeats} seats left</p>
            </div>

            <div className="flex items-center gap-3">
              <Ticket className="text-amber-500 dark:text-indigo-500" size={20} />
              <p className="font-semibold">{event.price} ฿ / ticket</p>
            </div>
          </div>

          {/* Seat selector */}
          <div className="flex items-center gap-4 mb-4">
            <p className="font-medium">Seats:</p>

            <button
              className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              onClick={() => setSeats(Math.max(1, seats - 1))}
            >
              –
            </button>

            <span className="text-xl font-bold w-8 text-center">{seats}</span>

            <button
              className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              onClick={() =>
                setSeats(Math.min(event.availableSeats, seats + 1))
              }
            >
              +
            </button>
          </div>

          {/* Total price */}
          <p className="text-lg font-semibold mb-6">
            Total Price: <span className="text-amber-600 dark:text-indigo-500">{seats * event.price} ฿</span>
          </p>

          {/* Reserve Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleReserve}
            className="w-full bg-amber-500 dark:bg-indigo-500 text-white py-3 rounded-xl text-lg font-semibold shadow-md"
          >
            Reserve Ticket
          </motion.button>
        </motion.div>

        {/* Recommended Events */}
        {/* <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">You may also like</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow"
              >
                <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg mb-3" />
                <p className="font-semibold">Other Event {i}</p>
                <p className="text-sm opacity-70">Short description here...</p>
              </motion.div>
            ))}
          </div>
        </div> */}
      </div>
    </main>
  );
}
