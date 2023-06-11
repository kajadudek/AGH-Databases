import { FC, useEffect, useState, FormEvent, ChangeEvent } from "react";
import { z } from "zod";
import { fetchClient, fetchClientPost } from "@/services/fetchClient";
import SearchForm from "@/components/SearchForm";

const Connections: FC = () => {
  const [paths, setPaths] = useState<
    Array<{ stations: string[], travelTime: number, arrivalTime: number, totalPrice: number, connectionIds: string[] }>>([]);
  const [selectedPathIndex, setSelectedPathIndex] = useState<number | null>(null);
  const [passengers, setPassengers] = useState<Array<{ name: string, discount: string, seat: string, status: string }>
  >([]);

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
    setPassengers(prev => [...prev, { name: 'passenger', discount: 'NONE', seat: 'OPEN', status: 'ACTIVE' }]);
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
  
    // TODO - replacing with the email of currently logged in user
    const email = "jhon.doe@gee.com";
  
    console.log(passengers, paths[selectedPathIndex].connectionIds, paths[selectedPathIndex].totalPrice);
    
    for (const connectionId of paths[selectedPathIndex].connectionIds){
      const response = await fetchClientPost({
      endpoint: 'api/ticket',
      body: {
        email: email,
        connectionId: connectionId,
        passengers: passengers,
        price: paths[selectedPathIndex].totalPrice
      },
      schema: z.object({
        passengers: z.array(
          z.object({
            name: z.string(),
            discount: z.enum(["NONE", "CHILD", "STUDENT", "SENIOR"]),
            seat: z.enum(["OPEN", "COMPARTMENT"]),
            status: z.enum(["ACTIVE", "RETURNED"]),
          })
        ),
        connection: z.object({
          id: z.string()
        }),
        price: z.number(),
      }),
      });

      if (!response.ok) {
        console.error("Error buying tickets:", response.error);
      } else {
        console.log(response.data);
      }
    }
  };

  return (
    <div className="p-5 my-5">
      <SearchForm onSubmit={handleFormSubmit}/>

      {paths.length === 0 ? (<h1 className="font-bold text-xl mb-5">Brak dostępnych połączeń</h1>) 
      : (<h1 className="font-bold text-xl mb-5">Dostępne połączenia:</h1>)}

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
              <div className="flex flex-col items-end space-x-2 px-8">
                <button className="bg-orange-500 text-white px-4 py-2 h-10 rounded-md" onClick={() => {
                    setSelectedPathIndex(index);
                    setPassengers([{ name: 'passenger', discount: 'NONE', seat: 'OPEN', status: 'ACTIVE' }]);
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
                        Wagon:
                        <select name="seat" onChange={(e) => handleSeatChange(e, i)} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                          <option value="OPEN">Bezprzedziałowy</option>
                          <option value="COMPARTMENT">Przedziałowy</option>
                        </select>
                      </label>
                    </form>
                    <button className="text-orange-500 px-2 py-2 rounded-md m-1 mt-5" onClick={handleAddPassenger}><b>+</b></button>
                    <button className="text-orange-500 px-2 py-2 rounded-md m-1 mt-5" onClick={() => handleRemovePassenger(i)}><b>-</b></button>
                  </div>
                ))}
                <button className="bg-black text-white px-8 py-3 rounded-md m-1 mt-3" onClick={handleBuyTickets}>Kup bilety</button>
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
