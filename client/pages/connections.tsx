import { FC, useEffect, useState, FormEvent, ChangeEvent } from "react";
import { z } from "zod";
import { fetchClient, fetchClientPost } from "@/services/fetchClient";
import SearchForm from "@/components/SearchForm";

const Connections: FC = () => {
  const [paths, setPaths] = useState<
    Array<{ stations: string[], travelTime: number, arrivalTime: number, totalPrice: number, connectionIds: string[] }>>([]);
  const [selectedPathIndex, setSelectedPathIndex] = useState<number | null>(null);
  const [passengers, setPassengers] = useState<Array<{ discount: string, seat: string }>>([{ discount: 'NONE', seat: 'OPEN' }]);

  // Routes finding
  const handleFormSubmit = async (departure: string, arrival: string) => {
    const response = await fetchClientPost({
      endpoint: 'api/paths',
      body: { start: departure, end: arrival },
      schema: z.array(
        z.object({
          stations: z.array(z.string()),
          travelTime: z.number(),
          arrivalTime: z.number(),
          totalPrice: z.number(),
          connectionIds: z.array(z.string())
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

  // Handle ticket passengers properties
  const handleAddPassenger = () => {
    setPassengers(prev => [...prev, { discount: 'NONE', seat: 'OPEN' }]);
  };

  const handleRemovePassenger = (index: number) => {
    setPassengers(prev => prev.filter((_, i) => i !== index));
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    setPassengers(prev =>
      prev.map((passenger, i) => 
        i === index ? {...passenger, discount: e.target.value} : passenger
      )
    );
  };

  const handleSeatChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    setPassengers(prev =>
      prev.map((passenger, i) =>
        i === index ? {...passenger, seat: e.target.value} : passenger
      )
    );
  };

  // Buying tickets
  const handleBuyTickets = async () => {
    if (selectedPathIndex === null) {
      console.error("No path selected");
      return;
    }
  
    const email = "email@email.com"; // Replace with the email of the currently logged in user
    const connectionId = paths[selectedPathIndex].connectionIds[0]; // Replace with the id of the selected path
  
    console.log(passengers, paths[selectedPathIndex].connectionIds, paths[selectedPathIndex].totalPrice);
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
            <li key={index} className="flex items-center justify-between min-h-16">
              <div>
                <b>Stacje:</b> {formattedStations}, <b>Czas podróży:</b> {formattedTime}
                <br />
                <b>Przesiadki:</b> {path.stations.length - 2}
              </div>
              <div className="px-8">
                <button className="bg-orange-500 text-white px-4 py-2 h-10 rounded-md" onClick={() => {
                    setSelectedPathIndex(index);
                    setPassengers([{ discount: 'NONE', seat: 'OPEN' }]);
                }}>
                  <b>Cena:</b> {path.totalPrice}
                </button>

                {selectedPathIndex === index &&
                <>
                 {passengers.map((passenger, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <form className="flex items-center space-x-2">
                      <label>
                        Zniżka:
                        <select name="discount" onChange={(e) => handleDiscountChange(e, i)} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                          <option value="NONE">Brak</option>
                          <option value="CHILD">Dziecko</option>
                          <option value="STUDENT">Student</option>
                          <option value="SENIOR">Senior</option>
                        </select>
                      </label>
                      <label>
                        Miejsce:
                        <select name="seat" onChange={(e) => handleSeatChange(e, i)} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                          <option value="OPEN">Open</option>
                          <option value="COMPARTMENT">Compartment</option>
                        </select>
                      </label>
                    </form>
                    <button className="bg-orange-500 text-white px-2 py-5 rounded-md m-1" onClick={handleAddPassenger}>+</button>
                    <button className="bg-orange-500 text-white px-2 py-5 rounded-md m-1" onClick={() => handleRemovePassenger(i)}>-</button>
                  </div>
                ))}
                <button className="bg-orange-500 text-white px-2 py-3 rounded-md m-1" onClick={handleBuyTickets}>Kup Bilety</button>
                </>
              }
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Connections;
