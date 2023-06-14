import { RangeSlider } from "flowbite-react";
import Link from "next/link";
import { FC, FormEvent, useRef } from "react";

interface SearchFormProps {
  onSubmit: (departure: string, arrival: string, departureTime: string, arrivalTime: string) => void;
}

const SearchForm: FC<SearchFormProps> = ({onSubmit}) => {
  const departureInputRef = useRef<HTMLInputElement>(null);
  const arrivalInputRef = useRef<HTMLInputElement>(null);
  const departureTimeInputRef = useRef<HTMLInputElement>(null);
  const arrivalTimeInputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
  
    const departureStation = departureInputRef.current?.value;
    const arrivalStation = arrivalInputRef.current?.value;
    const departureTime = departureTimeInputRef.current?.value || "";
    const arrivalTime = arrivalTimeInputRef.current?.value || "";
  
    if (departureStation && arrivalStation) {
      onSubmit(departureStation, arrivalStation, departureTime, arrivalTime);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col items-center justify-center"
    >
      <div className="flex flex-row">
        <div className="flex flex-col">
          <input
            ref={departureInputRef}
            className="rounded-md border-2 ml-2 border-gray-300 bg-white h-10 px-5 pr-16 text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Departure Station"
          />
          <input
            ref={departureTimeInputRef}
            className="rounded-md border-2 ml-2 border-gray-300 bg-white h-10 px-5 pr-16 text-sm focus:outline-none"
            type="time"
            name="time"
            placeholder="Time"
          />
        </div>
        <div className="flex flex-col">
          <input
            ref={arrivalInputRef}
            className="rounded-md border-2 ml-2 border-gray-300 bg-white h-10 px-5 pr-16 text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Arrival Station"
          />
          <input
            ref={arrivalTimeInputRef}
            className="rounded-md border-2 ml-2 border-gray-300 bg-white h-10 px-5 pr-16 text-sm focus:outline-none"
            type="time"
            name="time"
            placeholder="Time"
          />
        </div>
      </div>
      <button
        className="bg-slate-900 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded my-4"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default SearchForm;
