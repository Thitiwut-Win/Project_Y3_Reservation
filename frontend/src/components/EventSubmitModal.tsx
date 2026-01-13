"use client";
import { TextareaAutosize } from "@mui/material";
import { useState } from "react";

export default function EventSubmitModal({ open, onClose }: { open: boolean, onClose: () => void }) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [venue, setVenue] = useState("");
	const [category, setCategory] = useState("");
	const [datetime, setDatetime] = useState("");
	const [totalSeats, setTotalSeats] = useState("");
	const [availableSeats, setAvailableSeats] = useState("");
	const [price, setprice] = useState("");

	if (!open) return null;

	function createEvent() {

	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

			<div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 animate-modal-in" >
				<h2 className="text-2xl font-bold mb-4 text-yellow-600 dark:text-blue-400">
					Submit an Event
				</h2>

				<form className="space-y-4 flex flex-col">
					<input type="text" placeholder="Event name" className="input" required />
					<TextareaAutosize placeholder="Description" maxRows={3} className="input" />
					<input type="text" placeholder="Venue" className="input" />
					<input type="text" placeholder="Category (e.g. Concert, Workshop)" className="input" />
					<input type="datetime-local" className="input" required />
					<div className="grid grid-cols-2 gap-4">
						<input type="number" placeholder="Total seats" className="input" min={1} required />
						<input type="number" placeholder="Available seats" className="input" min={1} required />
					</div>
					<input type="number" placeholder="Price (฿)" className="input" min={1} />
					<div className="flex justify-end gap-3 pt-4">
						<button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-600 hover:text-white
						hover:opacity-80" >
							Cancel
						</button>
						<button type="submit" className="px-6 py-2 rounded-lg bg-yellow-500 dark:bg-blue-600 text-white
						hover:bg-amber-500 dark:hover:bg-indigo-500 transition">
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
