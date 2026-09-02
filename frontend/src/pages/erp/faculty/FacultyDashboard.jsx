import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";

export default function FacultyDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/erp/faculty/me")
      .then((res) => setProfile(res.data.data))
      .catch((err) => console.error("Error fetching faculty profile:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading faculty profile...</span>
        </div>
      </div>
    );
  }

  const quickLinks = [
    { title: "My Assigned Courses", desc: "View subjects & student list", path: "/erp/faculty/courses", badge: "Teaching" },
    { title: "Mark Student Attendance", desc: "Session attendance log", path: "/erp/faculty/attendance", badge: "Log Attendance" },
    { title: "Teaching Schedule", desc: "Weekly lecture timetable", path: "/erp/faculty/timetable", badge: "Timetable" },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-[#0b0f19] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                ERP Faculty Portal
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Academic Year 2025–26</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Faculty Command Center
            </h1>
          </div>
        </div>

        {profile ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Profile & Quick Links */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-3.5 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-lg flex items-center justify-center border border-indigo-200/60 dark:border-indigo-800 shrink-0">
                    {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      Prof. {profile.firstName} {profile.lastName}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{profile.designation || "Faculty Member"}</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Employee ID:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{profile.employeeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Department:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{profile.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Qualification:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{profile.qualification || "Ph.D."}</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Faculty Actions</h3>
                <div className="space-y-3">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="card-panel p-4 hover:border-indigo-400 dark:hover:border-indigo-500 flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {link.badge}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {link.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{link.desc}</p>
                      </div>
                      <span className="text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Assigned Courses Summary */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Teaching Courses</h3>

              {profile.assignedCourses?.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No Courses Assigned</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">No teaching courses have been mapped to your profile for this semester.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.assignedCourses?.map((c, i) => (
                    <div key={i} className="card-panel p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 px-2.5 py-0.5 rounded-lg">
                          {c.courseCode || "CS-101"}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Sem {c.semester || 1}</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{c.name}</h4>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <span>Credits: <strong>{c.credits || 3}</strong></span>
                        <Link to="/erp/faculty/attendance" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                          Log Attendance &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            ⚠️ Faculty profile details unavailable.
          </div>
        )}
      </div>
    </div>
  );
}
