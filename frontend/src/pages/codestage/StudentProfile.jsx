import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function StudentProfile() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const stats = {
    totalSolved: 124,
    easy: 60,
    medium: 50,
    hard: 14,
    totalEasy: 200,
    totalMedium: 300,
    totalHard: 100,
  };

  const recentSubmissions = [
    { id: 1, title: "Two Sum", difficulty: "easy", language: "cpp", date: "2 days ago", status: "Accepted" },
    { id: 2, title: "Longest Substring Without Repeating Characters", difficulty: "medium", language: "python", date: "3 days ago", status: "Accepted" },
    { id: 3, title: "Median of Two Sorted Arrays", difficulty: "hard", language: "java", date: "1 week ago", status: "Wrong Answer" },
  ];

  const totalAvailable = stats.totalEasy + stats.totalMedium + stats.totalHard;
  const percentage = Math.round((stats.totalSolved / totalAvailable) * 100);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-[#0b0f19] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Link to="/codestage" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                &larr; CodeStage Directory
              </Link>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Developer Metrics</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {user?.name}'s Developer Profile
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Inspect developer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors">
              Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Progress & Breakdown */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
              <h2 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Problem Solving Overview
              </h2>

              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-xs shrink-0">
                  {stats.totalSolved}
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Solved</span>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white">{percentage}% Completion</p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{stats.totalSolved} / {totalAvailable} Problems</span>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-emerald-700 dark:text-emerald-400">Easy</span>
                    <span className="text-slate-600 dark:text-slate-400">{stats.easy} / {stats.totalEasy}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(stats.easy / stats.totalEasy) * 100}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-amber-700 dark:text-amber-400">Medium</span>
                    <span className="text-slate-600 dark:text-slate-400">{stats.medium} / {stats.totalMedium}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(stats.medium / stats.totalMedium) * 100}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-rose-700 dark:text-rose-400">Hard</span>
                    <span className="text-slate-600 dark:text-slate-400">{stats.hard} / {stats.totalHard}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(stats.hard / stats.totalHard) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recent Submissions Log */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Submissions</h2>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Activity History</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-modern">
                  <thead>
                    <tr>
                      <th>Problem Title</th>
                      <th>Language</th>
                      <th>Submitted</th>
                      <th>Result Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="font-bold text-slate-900 dark:text-white text-xs">{sub.title}</td>
                        <td className="font-mono text-xs uppercase font-semibold text-slate-600 dark:text-slate-400">{sub.language}</td>
                        <td className="text-xs text-slate-400 dark:text-slate-500 font-medium">{sub.date}</td>
                        <td>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            sub.status === "Accepted"
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                              : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
