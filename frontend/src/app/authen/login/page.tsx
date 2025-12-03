"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "authenticated") {
			router.push("/events");
		}
	}, [status, router]);

	const handleLogin = async () => {
		const res = await signIn("credentials", {
			redirect: false,
			email,
			password,
		});

		if (res?.error) {
			setError(res.error);
		} else {
			window.dispatchEvent(new Event("auth-change"));
			router.push("/events");
		}
	};

	if (status === "loading") return <p className="text-center p-6">Checking session . . .</p>;
	if (status === "authenticated") return null;

	return (
		<main className="max-w-md mx-auto my-8 bg-white dark:bg-gray-800 p-6 rounded shadow">
			{error && <p className="text-red-500 dark:text-red-400 mb-2 text-center text-lg">{error}</p>}
			<h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Login</h1>

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
				onClick={handleLogin}
				className="w-full bg-yellow-500 dark:bg-blue-600 text-white py-2 rounded-xl transition hover:bg-amber-500 dark:hover:bg-indigo-500 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105"
			>
				Login
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
		</main>
	);
}
