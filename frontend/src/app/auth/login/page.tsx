"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	const router = useRouter();

	const handleLogin = async () => {
		try {
			const res = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
			localStorage.setItem("token", res.data.token);
			window.dispatchEvent(new Event("auth-change"));
			router.push("/events");
		} catch (error: any) {
			if (error.response) {
				setError(error.response.data.message || "Login failed");
			} else if (error.request) {
				setError("No response from server. Check your network.");
			} else {
				setError("Error: " + error.message);
			}
		}
	};

	return (
		<main className="max-w-md mx-auto my-8 bg-white dark:bg-gray-800 p-6 rounded shadow">
			{error && <p className="text-red-500 dark:text-red-400 mb-2 text-center text-lg">{error}</p>}
			<h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Login</h1>

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
				onClick={handleLogin}
				className="w-full bg-yellow-500 dark:bg-blue-600 text-white py-2 rounded-xl transition delay-50 duration-500 
        		hover:bg-amber-500 dark:hover:bg-indigo-500 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105"
			>
				Login
			</button>
		</main>
	);
}
