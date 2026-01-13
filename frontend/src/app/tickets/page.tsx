"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Ticket } from "@/types/Ticket";
import { toast } from "sonner";
import { LinearProgress } from "@mui/material";
import { motion } from "framer-motion";
import ConfirmDialog from "@/components/ConfirmModal";
import { cancelTicket, getMyTickets } from "@/services/ticketService";

export default function TicketsPage() {
	const { data: session } = useSession();
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [loading, setLoading] = useState(true);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [ticketToCancel, setTicketToCancel] = useState<string>("");

	const router = useRouter();

	const containerVariants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren: 0.12, delayChildren: 0.1 }
		}
	};

	const cardVariants = {
		hidden: { opacity: 0, y: 30 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.4, ease: "easeOut" }
		}
	} as const;

	const fadeIn = {
		hidden: { opacity: 0 },
		show: { opacity: 1, transition: { duration: 0.4 } }
	};

	useEffect(() => {
		if (!session?.user?.token) {
			router.replace("/authen/login");
			toast.warning("Please login first.");
			return;
		}

		const fetchTickets = async () => {
			try {
				const data = await getMyTickets(session.user.token);
				setTickets(data.tickets);
			} catch {
				toast.error("Failed to load tickets.");
			} finally {
				setLoading(false);
			}
		};

		fetchTickets();
	}, [session, router]);


	const confirmCancel = (id: string) => {
		setTicketToCancel(id);
		setConfirmOpen(true);
	};

	const handleConfirmCancel = async () => {
		if (!ticketToCancel) return;

		try {
			if (!session?.user?.token) {
				router.replace("/authen/login");
				toast.warning("Please login first.");
				return;
			}
			const data = await cancelTicket(ticketToCancel, session?.user.token)
			router.refresh();
			toast.success("Ticket cancelled!");
		} catch (err) {
			toast.error("Failed to cancel ticket.");
		} finally {
			setConfirmOpen(false);
		}
	};


	if (loading)
		return (
			<main className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
				<p className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-200">
					Loading tickets…
				</p>
				<LinearProgress />
				<div className="mt-6 space-y-4">
					{[1, 2, 3].map(i => (
						<div
							key={i}
							className="w-full h-20 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"
						/>
					))}
				</div>
			</main>
		);

	return (
		<motion.main
			variants={fadeIn}
			initial="hidden"
			animate="show"
			className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen"
		>
			<h1 className="text-3xl font-bold mb-6">My Tickets</h1>

			{tickets.length === 0 ? (
				<motion.div
					variants={fadeIn}
					initial="hidden"
					animate="show"
					className="text-center flex flex-col items-center mt-20"
				>
					<img
						src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
						className="w-40 h-40 opacity-80"
						alt="no tickets"
					/>
					<p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
						{"You haven't reserved any tickets yet."}
					</p>
				</motion.div>
			) : (
				<motion.ul
					variants={containerVariants}
					initial="hidden"
					animate="show"
					className="space-y-4"
				>
					{tickets.map(ticket => (
						<motion.div
							key={ticket._id}
							variants={cardVariants}
							className="flex flex-row bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition"
						>
							<li className="flex-grow">
								<p className="text-lg font-semibold">{ticket.event.name}</p>
								<p className="text-gray-600 dark:text-gray-300">
									Date: {new Date(ticket.event.date).toLocaleString()}
								</p>
								<p
									className={`font-medium mt-1 ${ticket.status === "cancelled"
										? "text-red-400"
										: "text-green-500"
										}`}
								>
									{ticket.status === "cancelled" ? "Cancelled" : "Active"}
								</p>
							</li>

							<motion.button
								whileTap={{ scale: 0.92 }}
								whileHover={{
									scale: ticket.status === "cancelled" ? 1 : 1.05
								}}
								onClick={() => confirmCancel(ticket._id)}
								className={`h-10 my-auto px-4 rounded-lg font-medium text-white ${ticket.status === "cancelled"
									? "bg-gray-400 cursor-not-allowed"
									: "bg-red-400 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600"
									}`}
								disabled={ticket.status === "cancelled"}
							>
								{ticket.status === "cancelled" ? "Cancelled" : "Cancel"}
							</motion.button>
						</motion.div>
					))}
				</motion.ul>
			)}
			<ConfirmDialog
				open={confirmOpen}
				title="Cancel this ticket?"
				description="You will lose your reservation. This action cannot be undone."
				onConfirm={handleConfirmCancel}
				onCancel={() => setConfirmOpen(false)}
			/>
		</motion.main>
	);
}
