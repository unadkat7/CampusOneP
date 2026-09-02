import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/erp/students/me/attendance")
      .then((res) => setAttendance(res.data.data || []))
      .catch((err) => console.error("Error fetching attendance:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading attendance metrics...</span>
        </div>
      </div>
    );
  }

  const overallAttended = attendance.reduce((acc, a) => acc + (a.attended || 0), 0);
  const overallTotal = attendance.reduce((acc, a) => acc + (a.totalClasses || 0), 0);
  const overallPercentage = overallTotal > 0 ? Math.round((overallAttended / overallTotal) * 100) : 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-[#0b0f19] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Link to="/erp/student" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                &larr; Student Portal
              </Link>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Performance Metrics</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Attendance Records
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-4 py-2 shadow-xs text-center">
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Overall Aggregate</div>
              <div className={`text-base font-extrabold mt-0.5 ${overallPercentage >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {overallPercentage}%
              </div>
            </div>
          </div>
        </div>

        {attendance.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No Attendance Logged</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Attendance records will appear here as faculty members log sessions.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-modern">
                <thead>
                  <tr>
                    <th>Course Code & Title</th>
                    <th>Total Sessions</th>
                    <th>Attended</th>
                    <th>Absent</th>
                    <th>Attendance %</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {attendance.map((a, i) => {
                    const isLow = a.belowMinimum || a.percentage < 75;
                    return (
                      <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="font-medium text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 px-2 py-0.5 rounded-md">
                              {a.course?.courseCode || "CS-101"}
                            </span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{a.course?.name || "Subject"}</span>
                          </div>
                        </td>
                        <td className="text-xs font-semibold text-slate-600 dark:text-slate-400">{a.totalClasses}</td>
                        <td className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{a.attended}</td>
                        <td className="text-xs font-semibold text-rose-500 dark:text-rose-400">{a.absent}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${isLow ? "bg-rose-500" : "bg-emerald-500"}`}
                                style={{ width: `${Math.min(a.percentage, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">{a.percentage}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            isLow ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800" : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                          }`}>
                            {isLow ? "Low Attendance" : "On Track"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
