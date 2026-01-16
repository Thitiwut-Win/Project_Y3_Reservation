export interface Event {
    _id: string;
    name: string;
    description: string,
    venue: string;
    date: string;
    availableSeats: number;
    totalSeats: number;
    price: number;
    category: string;
}
