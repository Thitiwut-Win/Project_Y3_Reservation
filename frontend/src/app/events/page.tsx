"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Event } from "@/types/Event";
import { LinearProgress } from "@mui/material";
import { Search, Music, Dumbbell, Sparkles, Presentation, Mic } from "lucide-react";
import EventSubmitModal from "@/components/EventSubmitModal";
import { useSearchParams } from "next/navigation";
import { getAllEvents } from "@/services/eventService";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filtered, setFiltered] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loadingMessage, setLoadingMessage] = useState("Loading events . . .");
  const [open, setOpen] = useState(false);

  const categories = [
    { id: "all", name: "All", icon: Sparkles },
    { id: "music", name: "Music", icon: Music },
    { id: "workshop", name: "Workshop", icon: Presentation },
    { id: "sports", name: "Sports", icon: Dumbbell },
    { id: "conference", name: "Conference", icon: Mic },
  ];

  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("submit") === "true") {
      setOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoadingMessage("Connecting to Render Server . . .");
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(data);
        setFiltered(data);
      } catch (err) {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    let list = [...events];

    if (activeCategory !== "all") {
      list = list.filter((e) => e.category === activeCategory);
    }

    if (search.trim() !== "") {
      const lower = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(lower) ||
          e.description.toLowerCase().includes(lower)
      );
    }

    setFiltered(list);
  }, [search, activeCategory, events]);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.1, ease: "easeOut" } },
  } as const;

  return (
    <main className="relative p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen overflow-hidden">

      {/* Floating animated background shapes */}
      <div className="pointer-events-none absolute top-10 left-20 w-72 h-72 lg:bg-yellow-500/30 lg:dark:bg-indigo-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute bottom-10 right-20 w-64 h-64 lg:bg-amber-500/30 lg:dark:bg-purple-500/30 rounded-full blur-3xl animate-bounce" />

      <h1 className="text-4xl font-extrabold mt-8 mb-10 text-center">
        Explore All Events
      </h1>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-6 relative">
        <Search className="absolute left-4 top-3 text-gray-500 dark:text-gray-400" size={20} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by event name or description"
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 shadow focus:ring-2 focus:ring-amber-500 dark:focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition shadow-sm
                ${activeCategory === cat.id
                  ? "bg-amber-500 dark:bg-indigo-500 text-white border-transparent"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:scale-105"
                }`}
            >
              <Icon size={18} />
              {cat.name}
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : loading ? (
        <div className="max-w-xl mx-auto text-center space-y-4">
          <p>{loadingMessage}</p>
          <LinearProgress />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center opacity-70 mt-20">
          <p className="text-xl">No events found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-6xl mx-auto">
          {filtered.map((event) => (
            <div
              key={event._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden transition"
            >
              {/* Banner */}
              <img
                src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
                alt="Event banner"
                className="h-40 w-full object-cover"
              />

              <div className="p-6">
                <h2 className="text-lg font-semibold">{event.name}</h2>

                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                  {event.description}
                </p>

                <p className="text-sm mt-2">📍 {event.venue}</p>
                <p className="text-sm">🕒 {new Date(event.date).toLocaleString()}</p>

                <p className="text-sm mt-2">
                  <strong>{event.availableSeats}</strong> seats left
                </p>

                <p className="text-sm font-semibold mt-1">{event.price} ฿</p>

                <Link
                  href={`/events/${event._id}`}
                  className="block mt-4 text-center bg-amber-500 dark:bg-indigo-500 text-white py-2 rounded-lg font-medium hover:scale-[1.03] transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 px-6 py-4 rounded-xl bg-yellow-500 dark:bg-blue-600 text-white font-semibold shadow-lg hover:shadow-2xl
        hover:bg-amber-500 dark:hover:bg-indigo-500 hover:scale-105 transition-all"
      >
        + Submit Event
      </button>
      <EventSubmitModal open={open} onClose={() => setOpen(false)} />
    </main>
  );
}
