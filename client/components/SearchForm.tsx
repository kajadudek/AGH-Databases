import { FC } from "react";

const SearchForm: FC = () => {
  return (
    <form className="flex flex-col items-center justify-center">
      <input
        className="rounded-md border-2 border-gray-300 bg-white h-10 px-5 pr-16 text-sm focus:outline-none"
        type="search"
        name="search"
        placeholder="Search"
      />
      <input
        className="rounded-md border-2 border-gray-300 bg-white h-10 px-5 pr-16 text-sm focus:outline-none"
        type="search"
        name="search"
        placeholder="Search"
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};

export default SearchForm;
