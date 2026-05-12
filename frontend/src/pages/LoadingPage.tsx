import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const loadingTexts = [
  "Analyzing your preferences...",
  "Checking hotel ratings...",
  "Finding best locations...",
  "Matching facilities...",
  "Generating AI recommendations...",
];

function LoadingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") || "";

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev === loadingTexts.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/results?query=${encodeURIComponent(query)}`);
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate, query]);

  return (
    <div className="min-h-screen bg-[#071028] text-white flex flex-col items-center justify-center px-6">
      <div className="w-28 h-28 border-[10px] border-cyan-400 border-t-transparent rounded-full animate-spin"></div>

      <h1 className="text-6xl font-bold mt-10">
        NeuroStay AI
      </h1>

      <p className="text-gray-300 text-2xl mt-6 transition-all duration-300">
        {loadingTexts[index]}
      </p>

      <p className="text-cyan-400 text-xl mt-4 text-center">
        "{query}"
      </p>
    </div>
  );
}

export default LoadingPage;