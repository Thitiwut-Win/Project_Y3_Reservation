import { Event } from "./Event";

export interface Ticket {
    _id: string;
    status: "reserved" | "cancelled";
    event: Event;
}
