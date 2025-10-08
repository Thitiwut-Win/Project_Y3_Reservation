import PaymentPageClient from "@/components/PaymentPageClient";
import { Suspense } from "react";

export default function PaymentPage() {
	return (
		<Suspense fallback={<p>Loading payment...</p>}>
			<PaymentPageClient />
		</Suspense>
	);
}
