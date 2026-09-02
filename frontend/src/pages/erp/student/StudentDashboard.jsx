import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/erp/students/me");
        setProfile(res.data.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading student profile...</span>
        </div>
      </div>
    );
  }

  const quickLinks = [
    { title: "My Courses", desc: "Registered subjects & credits", path: "/erp/student/courses", badge: "Enrolled", color: "indigo" },
    { title: "Attendance", desc: "Subject percentage & logs", path: "/erp/student/attendance", badge: "Tracked", color: "emerald" },
    { title: "Timetable", desc: "Weekly class schedule", path: "/erp/student/timetable", badge: "Schedule", color: "amber" },
    { title: "Fee Records", desc: "Invoices & payment status", path: "/erp/student/fees", badge: "Financial", color: "slate" },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 dark:bg-[#0b0f19] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                ERP Student Portal
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Academic Year 2025–26</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Student Control Center
            </h1>
          </div>
        </div>

        {profile ? (
          <div className="space-y-8">
            {/* Student Profile Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-extrabold text-xl flex items-center justify-center shadow-xs shrink-0">
                    {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Enrollment ID: <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{profile.enrollmentNo}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold">
                        {profile.department}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold">
                        {profile.program}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
                        Semester {profile.semester}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-center min-w-[100px]">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Semester</span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5 block">{profile.semester}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-center min-w-[100px]">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Status</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links Navigation */}
            <div className="space-y-4">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Academic Portals
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between group space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {link.badge}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{link.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            ⚠️ Profile details unavailable. Please contact the administrator.
          </div>
        )}
      </div>
    </div>
  );
}
