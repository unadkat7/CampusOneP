import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Dashboard — Main role-based navigation hub with dark mode support.
 */

const MODULE_CARDS = [
  {
    title: "ERP Portal",
    subtitle: "University Management",
    description: "Student profiles, course registrations, attendance tracking, fee invoices, and timetable schedules.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    path: "/erp",
    tag: "Core Module",
    roles: ["student", "faculty", "admin"],
  },
  {
    title: "Classroom",
    subtitle: "Interactive Learning",
    description: "Virtual classrooms, course announcements, syllabus materials, and assignment submission streams.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    path: "/classroom",
    tag: "Stream & Assignments",
    roles: ["student", "faculty", "admin"],
  },
  {
    title: "CodeStage",
    subtitle: "Coding Practice Platform",
    description: "Integrated online IDE, 30+ DSA problem set, test case execution, and developer progress metrics.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    path: "/codestage",
    tag: "Problem Solver",
    roles: ["student", "admin"],
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  const visibleCards = MODULE_CARDS.filter((card) => card.roles.includes(user?.role));

  const roleLabel = {
    student: "Student Account",
    faculty: "Faculty Member",
    admin: "System Administrator",
  };

  const roleBadgeStyle = {
    student: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    faculty: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    admin: "bg-slate-900 dark:bg-slate-800 text-white border-slate-700",
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 dark:bg-[#0b0f19] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${roleBadgeStyle[user?.role]}`}>
                {user?.role}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Connected Session</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.name || "User"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              Logged in as <span className="font-semibold text-slate-700 dark:text-slate-300">{roleLabel[user?.role]}</span> ({user?.email}).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-xl px-4 py-2.5 text-center">
              <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Status</div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active System
              </div>
            </div>
          </div>
        </div>

        {/* Module Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Campus Modules
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{visibleCards.length} Available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleCards.map((card) => (
              <div
                key={card.path}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/60 group-hover:scale-105 transition-transform">
                      {card.icon}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200/60 dark:border-slate-700">
                      {card.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">{card.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to={card.path}
                    className="inline-flex items-center justify-between w-full text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline"
                  >
                    <span>Launch Module</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
