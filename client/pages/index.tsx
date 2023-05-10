import SearchForm from "@/components/SearchForm";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div>Home Page</div>
      <Link href={"/example"}>Example Page</Link>
      <SearchForm />
    </div>
  );
}
