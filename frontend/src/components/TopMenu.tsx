"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";

export default function TopMenu() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const checkAuth = () => {
			const token = localStorage.getItem("token");
			setIsLoggedIn(!!token);
		};

		checkAuth();
		window.addEventListener("auth-change", checkAuth);

		return () => window.removeEventListener("auth-change", checkAuth);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		window.dispatchEvent(new Event("auth-change"));
	};

	return (
		<div className="flex items-center justify-between px-8 py-4 shadow bg-white dark:bg-gray-800">
			<h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
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
						<Link href="/auth/login" className="hover:underline text-gray-600 dark:text-gray-300">
							Login
						</Link>
						<Link href="/auth/register" className="hover:underline text-gray-600 dark:text-gray-300">
							Register
						</Link>
					</>
				)}

				<ThemeToggle />
			</nav>
		</div>
	);
}
