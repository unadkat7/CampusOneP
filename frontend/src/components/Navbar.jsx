import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { 
    path: "/dashboard", 
    label: "Dashboard", 
    roles: ["student", "faculty", "admin"],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ) 
  },
  { 
    path: "/erp", 
    label: "ERP Hub", 
    roles: ["student", "faculty", "admin"],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ) 
  },
  { 
    path: "/classroom", 
    label: "Classroom", 
    roles: ["student", "faculty", "admin"],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ) 
  },
  { 
    path: "/codestage", 
    label: "CodeStage", 
    roles: ["student", "admin"],
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ) 
  },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  const roleColors = {
    admin: "bg-slate-800 text-white border-slate-700",
    faculty: "bg-indigo-950/60 text-indigo-300 border-indigo-800",
    student: "bg-emerald-950/60 text-emerald-300 border-emerald-800",
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-500 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-white tracking-tight leading-none">
                Campus<span className="text-indigo-400">One</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
                Digital Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {visibleItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-slate-800 text-indigo-400 shadow-xs border border-slate-700"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <span className={isActive ? "text-indigo-400" : "text-slate-500"}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          {/* Role Badge */}
          <span className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${roleColors[user?.role] || "bg-slate-800 text-slate-300 border-slate-700"}`}>
            {user?.role}
          </span>

          {/* User Menu Dropdown */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800 cursor-pointer border border-slate-700 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-indigo-900/60 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-700/60">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="hidden lg:flex flex-col text-left pr-1">
                <span className="text-xs font-bold text-slate-200 leading-tight line-clamp-1">{user?.name}</span>
                <span className="text-[10px] text-slate-500 font-medium leading-tight line-clamp-1">{user?.email}</span>
              </div>
              <svg className="w-4 h-4 text-slate-400 hidden lg:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </label>

            <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-slate-900 rounded-2xl w-56 border border-slate-800 mt-2 space-y-1 z-50">
              <li className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white">{user?.name}</p>
                <p className="text-[11px] text-slate-400 font-normal truncate">{user?.email}</p>
              </li>

              {/* Mobile nav links inside dropdown */}
              <div className="md:hidden space-y-1 pt-1 border-b border-slate-800 pb-1">
                {visibleItems.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-xs font-medium text-slate-300">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </div>

              <li>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
