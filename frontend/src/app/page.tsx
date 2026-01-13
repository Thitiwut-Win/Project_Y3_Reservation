"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { Event } from "@/types/Event";
import { LinearProgress } from "@mui/material";
import { motion } from "framer-motion";
import { Dumbbell, Mic, Music, Presentation } from "lucide-react";

export default function HomePage() {
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingMessage, setLoadingMessage] = useState("Loading events . . .");

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
				const res = await axios.get<Event[]>(`${process.env.NEXT_PUBLIC_API_URL}/api/events`);
				setEvents(res.data);
			} catch (err) {
				console.error("Error fetching events:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchEvents();
	}, []);

	const fadeUp = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0, transition: { duration: 0.1, ease: "easeOut" } },
	} as const;
	const cardStagger = {
		hidden: {},
		show: {
			transition: {
				staggerChildren: 0.12,
				delayChildren: 0.08,
			},
		},
	};

	return (
		<main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">

			{/* Banner */}
			<section className="relative overflow-hidden px-8 py-16 text-center bg-gradient-to-br 
        from-amber-400 via-amber-500 to-amber-600 
        dark:from-indigo-500 dark:via-indigo-600 dark:to-indigo-700 text-white shadow-lg">

				<div className="absolute -top-10 -left-10 w-40 h-40 bg-white/20 dark:bg-white/10 rounded-full blur-3xl"></div>
				<div className="absolute top-20 right-10 w-56 h-56 bg-white/20 dark:bg-white/10 rounded-full blur-2xl"></div>

				<motion.h1 initial="hidden" animate="show" variants={fadeUp} className="text-5xl font-extrabold mb-4 tracking-tight">
					Reserve Your Next Event
				</motion.h1>

				<motion.p initial="hidden" animate="show" variants={fadeUp} transition={{ delay: 0.06 }} className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
					Discover concerts, workshops, meetups, and exclusive experiences.
				</motion.p>

				<motion.div initial="hidden" animate="show" variants={fadeUp}>
					<Link
						href="/events"
						className="inline-block mt-2 bg-white text-amber-600 dark:text-indigo-600 font-semibold px-8 py-4 
           rounded-xl shadow-md hover:shadow-xl transition-all duration-200 hover:scale-105"
					>
						Browse All Events
					</Link>
				</motion.div>
			</section>

			{/* Categories */}
			<motion.section
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.18 }}
				variants={cardStagger}
				className="px-8 py-16"
			>
				<motion.h2 variants={fadeUp} className="text-3xl font-bold mb-8 text-center">Explore Categories</motion.h2>

				<motion.div variants={cardStagger} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
					{[
						{ label: "Music", icon: <Music strokeWidth={3} size={32} className="mx-auto mb-4" /> },
						{ label: "Workshops", icon: <Presentation strokeWidth={3} size={32} className="mx-auto mb-4" /> },
						{ label: "Sports", icon: <Dumbbell strokeWidth={3} size={32} className="mx-auto mb-4" /> },
						{ label: "Conferences", icon: <Mic strokeWidth={3} size={32} className="mx-auto mb-4" /> },
					].map((cat) => (
						<motion.div
							key={cat.label}
							variants={fadeUp}
							className="group cursor-pointer p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md 
              hover:shadow-xl hover:-translate-y-1 transition-all text-center"
						>
							<div className="text-4xl group-hover:scale-110 transition">{cat.icon}</div>
							<p className="mt-2 font-semibold">{cat.label}</p>
						</motion.div>
					))}
				</motion.div>
			</motion.section>

			{/* Featured Event */}
			<motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="px-8 py-16">
				<motion.div variants={fadeUp} className="relative rounded-3xl overflow-hidden shadow-xl group">
					<img
						src="https://www.visitphilly.com/wp-content/uploads/2025/09/concert-courtesy-the-fillmore-2200x1237px.jpg"
						alt="Featured event crowd"
						className="w-full h-72 object-cover object-[50%_60%] group-hover:scale-105 transition duration-700"
					/>
					<div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-start px-10">
						<h3 className="text-3xl font-bold text-white">Featured Event</h3>
						<p className="text-white/80 mt-2">Join the biggest celebration of the year.</p>
						<Link
							href="/events"
							className="mt-4 px-6 py-3 bg-amber-500 dark:bg-indigo-500 text-white rounded-xl font-semibold 
              hover:scale-105 transition"
						>
							Book Now
						</Link>
					</div>
				</motion.div>
			</motion.section>

			{/* Upcoming Events */}
			<motion.section
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.18 }}
				variants={cardStagger}
				className="px-8 py-16"
			>
				<motion.h3 variants={fadeUp} className="text-3xl font-bold mb-8">Upcoming Events</motion.h3>

				{loading ? (
					<div className="space-y-4">
						<p className="text-gray-600 dark:text-gray-300">{loadingMessage}</p>
						<LinearProgress />
					</div>
				) : events.length === 0 ? (
					<p className="text-gray-600 dark:text-gray-300">No events available right now.</p>
				) : (
					<motion.ul variants={cardStagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{events.slice(0, 3).map((event) => (
							<motion.li
								key={event._id}
								className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all
                  hover:-translate-y-1 duration-300"
							>
								<h4 className="text-xl font-semibold mb-2">{event.name}</h4>

								<p className="text-sm text-gray-700 dark:text-gray-300">{event.venue}</p>
								<p className="text-sm text-gray-700 dark:text-gray-300">
									{new Date(event.date).toLocaleString()}
								</p>

								<p className="text-sm mt-3 mb-4">
									<span className="font-semibold">{event.availableSeats}</span> seats available
								</p>

								<Link
									href={`/events/${event._id}`}
									className="text-amber-600 dark:text-indigo-400 font-semibold flex items-center gap-1
                    transition-all duration-300 hover:gap-3"
								>
									View Details →
								</Link>
							</motion.li>
						))}
					</motion.ul>
				)}
			</motion.section>

			{/* How It Works */}
			<motion.section
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, amount: 0.18 }}
				variants={cardStagger}
				className="px-8 py-20 bg-gray-100 dark:bg-gray-900"
			>
				<motion.h2 variants={fadeUp} className="text-3xl font-bold text-center mb-12">How It Works</motion.h2>

				<motion.div variants={cardStagger} className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
					{[
						{
							title: "Browse Events",
							icon: "🔍",
							desc: "Search thousands of events happening around you.",
						},
						{
							title: "Reserve Seats",
							icon: "🪑",
							desc: "Choose your seats and secure your reservation instantly.",
						},
						{
							title: "Payment",
							icon: "📩",
							desc: "Pay for the tickets and reserve right away.",
						},
					].map((step) => (
						<motion.div
							key={step.title}
							variants={fadeUp}
							className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition"
						>
							<div className="text-5xl">{step.icon}</div>
							<h4 className="text-xl font-bold mt-4">{step.title}</h4>
							<p className="text-gray-600 dark:text-gray-300 mt-2">{step.desc}</p>
						</motion.div>
					))}
				</motion.div>
			</motion.section>

			{/* Banner */}
			<section className="px-8 py-20 text-center bg-gradient-to-r 
        from-amber-400 to-amber-500 dark:from-indigo-600 dark:to-indigo-700 text-white">
				<h2 className="text-4xl font-extrabold">Want to partner with us?</h2>
				<p className="text-lg mt-3 opacity-90">Submit your information and we will be in contact.</p>

				<Link
					href="/events?submit=true"
					className="mt-6 inline-block px-10 py-4 bg-white text-amber-600 dark:text-indigo-600 
          font-semibold rounded-xl shadow-md hover:scale-105 transition"
				>
					Submit Now
				</Link>
			</section>
		</main>
	);
}
