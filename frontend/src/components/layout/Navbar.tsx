import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/results?query=Chennai", label: "Hotels", icon: "🏨" },
    { path: "/map", label: "Map", icon: "🗺️" },
    { path: "/compare", label: "Compare", icon: "📊" },
    { path: "/saved", label: "Saved", icon: "💾" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-[#070b1d] border-r border-white/10 p-6 flex-col z-50">
        <Link to="/" className="text-3xl font-bold mb-8">
          NeuroStay
        </Link>

        <div className="bg-white/10 rounded-2xl p-4 mb-8">
          <p className="text-sm text-gray-400">Welcome</p>
          <p className="font-semibold">mounika</p>
        </div>

        <nav className="flex flex-col gap-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl font-medium ${
                  isActive ? "bg-white/10 text-white" : "text-gray-300"
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          {token && (
            <button
              onClick={logout}
              className="text-left px-4 py-3 rounded-xl text-red-400"
            >
              🚪 Logout
            </button>
          )}
        </nav>
      </aside>

      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#070b1d] border-b border-white/10 z-50 flex items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold">
          NeuroStay
        </Link>

        {token && (
          <button
            onClick={logout}
            className="text-sm bg-red-500/20 text-red-300 px-3 py-2 rounded-lg"
          >
            Logout
          </button>
        )}
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#070b1d] border-t border-white/10 z-50 grid grid-cols-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-xs ${
                isActive ? "text-cyan-400" : "text-gray-400"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Navbar;