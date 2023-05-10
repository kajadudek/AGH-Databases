import { FC } from "react";

const SearchForm: FC = () => {
  return (
    <form className="flex flex-col items-center justify-center">
      <div>
        <input
          className="rounded-md border-2 mr-2 border-gray-300 bg-white h-10 px-5 pr-16 text-sm focus:outline-none"
          type="search"
          name="search"
          placeholder="Departure Station"
        />
        <input
          className="rounded-md border-2 ml-2 border-gray-300 bg-white h-10 px-5 pr-16 text-sm focus:outline-none"
          type="search"
          name="search"
          placeholder="Arrival Station"
        />
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
