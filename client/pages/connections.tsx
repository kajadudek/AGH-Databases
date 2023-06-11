import { fetchClient, fetchClientPost } from "@/services/fetchClient";
import { FC, useEffect, useState } from "react";
import { z } from "zod";
import { type SeatType } from "../../server/types";
// import Connection from "../types/Connection";
import SearchForm from "@/components/SearchForm";

const Connections: FC = () => {
  const [paths, setPaths] = useState<
    Array<{ stations: string[], travelTime: number,
       arrivalTime: number, totalPrice: number }>>([]);

    const handleFormSubmit = async (departure: string, arrival: string) => {   
      const response = await fetchClientPost({
        endpoint: 'api/paths',
        body: { start: departure, end: arrival },
        schema: z.array(
          z.object({
            stations: z.array(z.string()),
            travelTime: z.number(),
            arrivalTime: z.number(),
            totalPrice: z.number()
          })
        )
      });
    
      if (!response.ok) {
        console.error(response.error);
      } else {
        console.log(response.data);
        setPaths(response.data);
      }
    };    

    return (
      <div className="p-5 my-5">
        <SearchForm onSubmit={handleFormSubmit}/>
    
        <h1>Dostępne połączenia</h1>

        <ul>
          {paths.map((path, index) => {
            const formattedStations = path.stations.join(' - ');
            const hours = Math.floor(path.travelTime / 3600000);
            const minutes = Math.floor((path.travelTime % 3600000) / 60000);
            const formattedTime = hours + ' godzin i ' + minutes + ' minut';
    
            return (
              <li key={index} className="flex items-center justify-between h-16">
                <div>
                  <b>Stacje:</b> {formattedStations}, <b>Czas podróży:</b> {formattedTime}
                  <br />
                  <b>Przesiadki:</b> {path.stations.length - 2}
                </div>
                <div>
                  <button className="bg-orange-500 text-white px-4 py-2 h-10 rounded-md">
                    <b>Cena:</b> {path.totalPrice}
                  </button>
                </div>
              </li>
            );            
                       
          })}
        </ul>
      </div>
    );
    
  
};

export default Connections;
