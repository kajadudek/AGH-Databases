import SearchForm from "@/components/SearchForm";
import { useEffect, useState } from "react";

export default function Home() {
  useTimeout(() => {}, 2000);
  const scroll = useScroll();
  console.log(scroll);
  return <div className="p-5 my-5 h-[100000px]">{scroll}</div>;
}

const useTimeout = (callback: () => void, ms: number) => {
  useEffect(() => {
    const resolve = setTimeout(callback, ms);
    return () => clearTimeout(resolve);
  }, [callback, ms]);
};

const useScroll = () => {
  const [position, setPosition] = useState(0);
  const handlePosition = () => setPosition(window.scrollY);

  useEffect(() => {
    console.log("adding listener");
    window.addEventListener("scroll", handlePosition, {
      passive: true,
    });
    return () => removeEventListener("scroll", handlePosition);
  }, []);
  return position;
};
