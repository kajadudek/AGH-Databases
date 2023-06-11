import { RangeSlider } from "flowbite-react";
import Link from "next/link";
import { FC } from "react";
import PriceSlider from "./PriceSlider";

const SearchForm: FC = () => {
  return (
    <form
      onSubmit={(data) => console.log(data)}
      className="flex flex-col items-center justify-center"
    >
      <div className="flex flex-row">
        <div className="flex flex-col">
          <input
            className="rounded-md border-2 ml-2 border-gray-300 bg-white h-10 px-5 pr-16 text-sm focus:outline-none"
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
          <div className="ml-2">
            <PriceSlider />
          </div>
        </div>
        <div className="flex flex-col">
          <input
            className="rounded-md border-2 ml-2 border-gray-300 bg-white h-10 px-5 pr-16 text-sm focus:outline-none"
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
          <div className="ml-2">
            <PriceSlider />
          </div>
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
