import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "mounika";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#070B1D] border-r border-white/10 px-6 py-7 text-white">
      <h1 className="text-3xl font-extrabold mb-7 tracking-tight">
        NeuroStay
      </h1>

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
                  ? "bg-[#1E293B] text-white"
                  : "text-slate-300 hover:bg-[#1E293B] hover:text-white"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-red-400 hover:bg-red-500/10 transition"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}