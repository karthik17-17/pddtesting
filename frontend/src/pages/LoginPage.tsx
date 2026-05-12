import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function LoadingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") || "";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/results?query=${encodeURIComponent(query)}`);
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, query]);

  return (
    <div className="min-h-screen bg-[#071028] text-white flex flex-col items-center justify-center px-6">
      <div className="w-24 h-24 border-8 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>

      <h1 className="text-6xl font-bold mt-10">
        NeuroStay AI
      </h1>

      <p className="text-gray-300 text-2xl mt-6 text-center">
        AI is analyzing your preferences...
      </p>

      <p className="text-cyan-400 text-xl mt-4">
        "{query}"
      </p>
    </div>
  );
}

export default LoadingPage;