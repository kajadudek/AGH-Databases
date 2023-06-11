import Link from "next/link";
import { FC, FormEvent, useRef } from "react";

interface SearchFormProps {
  onSubmit: (departure: string, arrival: string) => void;
}

const SearchForm: FC<SearchFormProps> = ({onSubmit}) => {
  const departureInputRef = useRef<HTMLInputElement>(null);
  const arrivalInputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    const departureStation = departureInputRef.current?.value;
    const arrivalStation = arrivalInputRef.current?.value;

    if (departureStation && arrivalStation) {
      onSubmit(departureStation, arrivalStation);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex flex-col items-center justify-center"
    >
      <div>
        <div>
          <input
            ref={departureInputRef}
            className="rounded-md border-2 mr-2 border-gray-300 bg-white h-10 px-5 pr-16 text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Departure Station"
          />
          <input
            className="rounded-md border-2 ml-2 border-gray-300 bg-white h-10 px-5 pr-16 text-sm focus:outline-none"
            type="date"
            name="date"
            placeholder="Date"
          />
          <input
            className="rounded-md border-2 ml-2 border-gray-300 bg-white h-10 px-5 pr-16 text-sm focus:outline-none"
            type="time"
            name="time"
            placeholder="Time"
          />
        </div>
        <div>
          <input
            ref={arrivalInputRef}
            className="rounded-md border-2 mr-2 border-gray-300 bg-white h-10 px-5 pr-16 text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Arrival Station"
          />
          <input
            className="rounded-md border-2 ml-2 border-gray-300 bg-white h-10 px-5 pr-16 text-sm focus:outline-none"
            type="date"
            name="date"
            placeholder="Date"
          />
          <input
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
