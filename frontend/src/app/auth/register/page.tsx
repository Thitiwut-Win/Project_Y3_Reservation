"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	const router = useRouter();

	const handleRegister = async () => {
		try {
			await axios.post(`${apiUrl}/api/auth/register`, { name, email, password });
			alert("Registration successful! Please log in.");
			router.push("/auth/login");
		} catch {
			alert("Registration failed.");
		}
	};

	return (
		<main className="max-w-md mx-auto my-8 bg-white dark:bg-gray-800 p-6 rounded shadow">
			<h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Register</h1>
			<input
				type="name"
				placeholder="Name"
				className="w-full border border-gray-950 dark:border-gray-300 p-2 mb-3 rounded-lg placeholder-gray-400 dark:placeholder-gray-500"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<input
				type="email"
				placeholder="Email"
				className="w-full border border-gray-950 dark:border-gray-300 p-2 mb-3 rounded-lg placeholder-gray-400 dark:placeholder-gray-500"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Password"
				className="w-full border border-gray-950 dark:border-gray-300 p-2 mb-3 rounded-lg placeholder-gray-400 dark:placeholder-gray-500"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button
				onClick={handleRegister}
				className="w-full bg-yellow-500 dark:bg-blue-600 text-white py-2 rounded-xl transition delay-50 duration-500 ease-in-out 
				hover:bg-amber-500 dark:hover:bg-indigo-500 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105"
			>
				Register
			</button>
		</main>
	);
}
