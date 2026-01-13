"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { signOut, useSession } from "next-auth/react";
import apiClient from "@/utils/apiClient";

export default function TopMenu() {
	const { data: session } = useSession();
	const isLoggedIn = !!session;

	const handleLogout = async () => {
		try {
			await apiClient.post("/api/auth/logout");
		} catch {
			console.log("Error logging out")
		} finally {
			await signOut({ callbackUrl: "/" });
		}
	};

	return (
		<div className="flex items-center justify-between px-8 py-4 shadow bg-white dark:bg-gray-800">
			<h1 className="text-xl font-bold text-yellow-600 dark:text-blue-400">
				<Link href="/" className="hover:underline">
					Events Reservation
				</Link>
			</h1>

			<nav className="flex items-center space-x-6">
				<Link href="/events" className="hover:underline text-gray-600 dark:text-gray-300">
					Events
				</Link>
				<Link href="/tickets" className="hover:underline text-gray-600 dark:text-gray-300">
					My Tickets
				</Link>

				{isLoggedIn ? (
					<button
						onClick={handleLogout}
						className="hover:underline text-red-600 dark:text-red-400"
					>
						Logout
					</button>
				) : (
					<>
						<Link href="/authen/login" className="hover:underline text-gray-600 dark:text-gray-300">
							Login
						</Link>
						<Link href="/authen/register" className="hover:underline text-gray-600 dark:text-gray-300">
							Register
						</Link>
					</>
				)}

				<ThemeToggle />
			</nav>
		</div>
	);
}
