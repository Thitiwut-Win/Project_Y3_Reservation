"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative flex items-center w-16 h-8 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors"
        >
            <span
                className={`absolute left-1 top-1 w-6 h-6 flex items-center justify-center rounded-full bg-white dark:bg-black transition-transform ${theme === "dark" ? "translate-x-8" : "translate-x-0"
                    }`}
            >
                {theme === "dark" ? (
                    <Moon className="w-4 h-4 text-blue-400" fill="oklch(70.7% 0.165 254.624)" />
                ) : (
                    <Sun className="w-4 h-4 text-yellow-500" fill="oklch(79.5% 0.184 86.047)" />
                )}
            </span>
        </button>
    );
}
