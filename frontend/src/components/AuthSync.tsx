"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthSync() {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (session?.user) {
            const backendToken =
                (session.user as any).backendToken || session.user.email || "google";
            localStorage.setItem("token", backendToken);
            window.dispatchEvent(new Event("auth-change"));

            if (!hasRedirected.current && ["/auth/login", "/auth/register"].includes(pathname)) {
                hasRedirected.current = true;
                router.push("/events");
            }
        }
    }, [session, router, pathname]);

    return null;
}
