export { type SeatType, Passenger, SeatStatus, Discount, Connection, Ticket } from "@prisma/client";
import { Discount } from "@prisma/client";

export type PassengerSimplyfied = {
  name: string,
  discount: Discount,
  seat: string,
  status: string
}

export type PassengerSimplyfied2 = {
    name: string,
    discount: string,
    seat: string,
    status: string
  }

export type TicketToDisplay = {
    id: string,
    connectionName: string,
    departureStation: string,
    arrivalStation: string,
    departure: string,
    arrival: string,
    price: number,
    passengers: PassengerSimplyfied2[]

}

// Finds all paths (has regard to arrival and departure time of trains)
export type Path = {
    stations: string[];
    travelTime: number; // hours
    arrivalTime: number; // time in milliseconds
    departureTime: number;
    totalPrice: number;
    connectionIds: string[];
    departureDate: Date;
    arrivalDate: Date;
  };