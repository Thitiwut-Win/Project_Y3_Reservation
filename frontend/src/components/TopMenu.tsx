import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function TopMenu() {
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
				<Link href="/auth/login" className="hover:underline text-gray-600 dark:text-gray-300">
					Login
				</Link>
				<Link href="/auth/register" className="hover:underline text-gray-600 dark:text-gray-300">
					Register
				</Link>
				<ThemeToggle />
			</nav>
		</div>
	);
}
