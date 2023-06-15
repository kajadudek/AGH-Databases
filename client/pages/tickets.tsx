import { fetchClient } from "@/services/fetchClient";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FC, use, useEffect, useState } from "react";
import { z } from "zod";
import {PassengerSimplyfied2} from "@/types";

type TicketElement = {
  id: string
  connectionName: string
  departureStation: string
  arrivalStation: string
  departure: string
  arrival: string
  price: number
  passengers: PassengerSimplyfied2[]
}

const Tickets: FC = () => {
  const [tickets, setData] = useState<TicketElement[]>([]);
  useEffect(() => {
    fetchClient({
      endpoint: "/api/tickets",
      schema: z.object({ ticketsArray: z.array(z.object({
        id: z.string(), 
        connectionName: z.string(), 
        departureStation: z.string(), 
        arrivalStation: z.string(), 
        departure: z.string(), 
        arrival: z.string(), 
        price: z.number(), 
        passengers: z.array(z.object({
          name: z.string(), 
          discount: z.string(), 
          seat: z.string(), 
          status: z.string()}))
      })) }),
    }).then((res) => {
      console.log(res);
      if (!res.ok) console.error(res.error);
      else setData(res.data.ticketsArray);
    });
  }, []);
  return (
    <div className="p-5 my-5">
      <ul>{tickets.length ? 
      tickets.map((ticket => 
        <div className="flex flex-row border-2 border-orange-500">
        <div>
        <li className="w-150 mx-2 p-1">{ticket.id}</li>
        <li className="w-150 mx-2 p-1">{ticket.connectionName}</li>
        <li className="w-150 mx-2 p-1">{ticket.departureStation}</li>
        <li className="w-150 mx-2 p-1">{ticket.arrivalStation}</li>
        <li className="w-150 mx-2 p-1">{ticket.departure}</li>
        <li className="w-150 mx-2 p-1">{ticket.arrival}</li>
        </div>
        <div>
        <li>{ticket.price}</li>
        <ul>{ticket.passengers.map((passenger =>
          <div>
          <li>{passenger.name}</li>
          <li>{passenger.discount}</li>
          <li>{passenger.seat}</li>
          <li>{passenger.status}</li>
          </div>
        ))}</ul>
        </div>
        </div>
      
      )) : "No tickets"}</ul>
    </div>
  );
};

export default Tickets;
