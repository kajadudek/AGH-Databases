export { type SeatType, Passenger, SeatStatus, Discount } from "@prisma/client";
import { Discount } from "@prisma/client";

export type PassengerSimplyfied = {
  name: string,
  discount: Discount,
  seat: string,
  status: string
}