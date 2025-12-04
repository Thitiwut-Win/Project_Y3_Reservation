"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MouseEventHandler } from "react";

export default function ConfirmDialog({ open, title, description, onConfirm, onCancel }:
    { open: boolean, title: string, description: string, onConfirm: MouseEventHandler<HTMLButtonElement>, onCancel: MouseEventHandler<HTMLButtonElement> }
) {
    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-sm text-center border border-gray-200 dark:border-gray-700"
                >
                    <h2 className="text-xl font-semibold mb-2">{title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 rounded-xl"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                        >
                            Confirm
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
