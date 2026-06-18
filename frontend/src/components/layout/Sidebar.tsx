import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const userName = user?.name || "User";

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const menuItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Hotels", path: "/results", icon: "🏨" },
    { name: "Map", path: "/map", icon: "🗺️" },
    { name: "Compare", path: "/compare", icon: "📊" },
    { name: "About", path: "/about", icon: "ℹ️" },
    { name: "Contact", path: "/contact", icon: "📞" },
    { name: "My Bookings", path: "/bookings", icon: "🧾" },
    { name: "Saved", path: "/saved", icon: "💾" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#070B1D] border-r border-white/10 px-6 py-7 text-white flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-7">
          <img src="/logo.svg" alt="NeuroStay AI Logo" className="w-10 h-10" />
          <h1 className="text-3xl font-extrabold tracking-tight">
            NeuroStay
          </h1>
        </div>

        <div className="bg-[#1E293B] rounded-2xl px-4 py-4 mb-7">
          <p className="text-sm text-slate-400">👤 Welcome</p>
          <h2 className="text-base font-bold mt-1">{userName}</h2>
        </div>

        <nav className="space-y-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition ${
                  isActive
                    ? "bg-[#1E293B] text-cyan-400 border-l-4 border-cyan-500 pl-3"
                    : "text-slate-300 hover:bg-[#1E293B] hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-red-400 hover:bg-red-500/10 transition mt-auto"
      >
        <span>🚪</span>
        <span>Logout</span>
      </button>
    </aside>
  );
}