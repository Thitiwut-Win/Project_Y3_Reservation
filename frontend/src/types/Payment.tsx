export interface Payment {
    id: string;
    userId: string;
    eventId: string;
    amout: number;
    seats: number;
    qrString: string;
    status: string;
    ref: string;
}
