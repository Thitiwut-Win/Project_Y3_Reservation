"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        const saved = localStorage.getItem("theme");

        if (saved === "dark") {
            root.className = "dark";
            setDark(true);
        } else if (saved === "light") {
            root.className = "";
            setDark(false);
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            root.className = prefersDark ? "dark" : "";
            setDark(prefersDark);
        }
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (dark) {
            root.className = "";
            localStorage.setItem("theme", "light");
            setDark(false);
        } else {
            root.className = "dark";
            localStorage.setItem("theme", "dark");
            setDark(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-colors ${dark ? "bg-slate-700" : "bg-yellow-400"
                }`}
            aria-label="Toggle theme"
        >
            <span
                className={`absolute w-6 h-6 rounded-full bg-white shadow transform transition-transform ${dark ? "translate-x-6" : "translate-x-0"
                    }`}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
                {dark ? "🌙" : "☀️"}
            </span>
        </button>
    );
}
