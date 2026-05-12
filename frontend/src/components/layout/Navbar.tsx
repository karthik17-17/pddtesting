import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("neurostayUser") || "{}");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-950 border-b border-slate-800 px-8 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-5xl font-bold text-white">
          NeuroStay AI
        </Link>

        <div className="flex items-center gap-6 text-slate-300 font-medium">
          <Link to="/">Home</Link>
          <Link to="/results">Results</Link>
          <Link to="/saved">Saved</Link>
          <Link to="/bookings">Bookings</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/map">Map</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/about">About</Link>
          <Link to="/summary">Summary</Link>
        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <p className="text-white font-semibold">
              {user.name || "User"}
            </p>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-400 px-5 py-2 rounded-xl font-semibold text-white"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-3 rounded-xl"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;