import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";

export default function FacultyTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/erp/faculty/me/timetable")
      .then((res) => setTimetable(res.data.data || []))
      .catch((err) => console.error("Error fetching timetable:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading teaching schedule...</span>
        </div>
      </div>
    );
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const grouped = days.reduce((acc, day) => {
    acc[day] = timetable.filter((t) => t.day === day);
    return acc;
  }, {});

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-[#0b0f19] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Link to="/erp/faculty" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                &larr; Faculty Portal
              </Link>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lecture Schedule</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Faculty Teaching Timetable
            </h1>
          </div>
        </div>

        {timetable.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No Teaching Sessions Assigned</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your lecture slots will appear here once allocated by department administration.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {days.map((day) => {
              const slots = grouped[day] || [];
              if (slots.length === 0) return null;

              return (
                <div key={day} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                      {day}
                    </h2>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{slots.length} Assigned Lectures</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                    {slots.map((slot, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 px-2 py-0.5 rounded-md">
                            {slot.courseId?.courseCode || "CS-101"}
                          </span>
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 rounded-md">
                            📍 {slot.room || "Room TBA"}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                          {slot.courseId?.name || "Lecture Session"}
                        </h3>

                        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            ⏰ {slot.startTime} – {slot.endTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
