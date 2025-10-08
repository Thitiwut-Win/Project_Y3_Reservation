import ClientOnly from '@/components/ClientOnly';
import PaymentPageClient from '@/components/PaymentPageClient';

export default function PaymentPage() {
	return (
		<ClientOnly>
			<PaymentPageClient />
		</ClientOnly>
	);
}
