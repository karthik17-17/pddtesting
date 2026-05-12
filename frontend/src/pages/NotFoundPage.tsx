import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#071028] text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-[150px] font-bold text-cyan-400 leading-none">
        404
      </h1>

      <h2 className="text-5xl font-bold mt-6">
        Page Not Found
      </h2>

      <p className="text-gray-400 text-xl mt-6 max-w-2xl leading-8">
        The page you are looking for does not exist
        or may have been moved.
      </p>

      <Link
        to="/"
        className="mt-10 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-10 py-5 rounded-2xl text-lg"
      >
        Back To Home
      </Link>
    </div>
  );
}

export default NotFoundPage;