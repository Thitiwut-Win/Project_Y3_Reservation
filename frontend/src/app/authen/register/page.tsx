"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { LinearProgress } from "@mui/material";
import apiClient from "@/utils/apiClient";

export default function RegisterPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "authenticated") {
			router.push("/");
		}
	}, [status, router]);

	const handleRegister = async () => {
		try {
			const res = await apiClient.post("/api/auth/register", { name, email, password });
			window.dispatchEvent(new Event("auth-change"));
			alert("Registration successful!");
			router.push("/authen/login");
		} catch (err: unknown) {
			if (axios.isAxiosError(err)) {
				const axiosErr = err as AxiosError<{ message?: string }>;
				setError(axiosErr.response?.data?.message || "Registration failed.");
			} else {
				setError("Network error. Try again later.");
			}
		}
	};

	if (status === "authenticated") return null;

	return (
		<main className="max-w-md mx-auto my-8 bg-white dark:bg-gray-800 p-6 rounded shadow">
			{error && <p className="text-red-500 dark:text-red-400 mb-2 text-center text-lg">{error}</p>}
			{(status === "loading" ? (
				<div>
					<p className="text-center">Checking session . . .</p>
					<LinearProgress />
				</div>) : (<div>
					<h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Register</h1>

					<input
						type="text"
						placeholder="Name"
						className="w-full border border-gray-950 dark:border-gray-300 p-2 mb-3 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-black dark:text-white"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<input
						type="email"
						placeholder="Email"
						className="w-full border border-gray-950 dark:border-gray-300 p-2 mb-3 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-black dark:text-white"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type="password"
						placeholder="Password"
						className="w-full border border-gray-950 dark:border-gray-300 p-2 mb-3 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 text-black dark:text-white"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<button
						onClick={handleRegister}
						className="w-full bg-yellow-500 dark:bg-blue-600 text-white py-2 rounded-xl transition hover:bg-amber-500 dark:hover:bg-indigo-500 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105"
					>
						Register
					</button>

					<div className="flex items-center my-4">
						<div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
						<span className="mx-2 text-gray-500 dark:text-gray-400">or</span>
						<div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
					</div>

					<button
						onClick={() => signIn("google", { callbackUrl: "/events" })}
						className="w-full bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-50 py-2 rounded-xl transition hover:bg-red-400 dark:hover:bg-red-500 hover:text-gray-100 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105"
					>
						Sign in with Google
					</button>
				</div>))
			}
		</main>
	);
}
