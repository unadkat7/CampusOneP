import { useEffect, useState } from "react";
import api from "../../../utils/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);
  const [tabData, setTabData] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);

  useEffect(() => {
    api.get("/erp/admin/stats")
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const loadTab = async (tab) => {
    if (activeTab === tab) {
      setActiveTab(null);
      return;
    }
    setActiveTab(tab);
    setTabLoading(true);
    try {
      const endpoints = {
        students: "/erp/students",
        faculty: "/erp/faculty",
        courses: "/erp/courses",
        announcements: "/erp/admin/announcements",
      };
      const res = await api.get(endpoints[tab]);
      setTabData(res.data.data || res.data || []);
    } catch (err) {
      console.error("Error loading admin tab data:", err);
      setTabData([]);
    } finally {
      setTabLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading system metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-[#0b0f19] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 dark:bg-indigo-600 text-white border border-slate-700 dark:border-indigo-500">
                System Administrator
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">CampusOne Master Control</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Admin System Dashboard
            </h1>
          </div>
        </div>

        {/* Metric Cards Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total Students</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">{stats.totalStudents}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total Faculty</span>
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 block">{stats.totalFaculty}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Active Courses</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">{stats.totalCourses}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Fee Defaulters</span>
              <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 block">{stats.feeDefaulters}</span>
            </div>
          </div>
        )}

        {/* Management Controls */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Directory Inspector
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "students", label: "👨‍🎓 Students Directory" },
              { id: "faculty", label: "👨‍🏫 Faculty Directory" },
              { id: "courses", label: "📚 Course Catalog" },
              { id: "announcements", label: "📢 System Announcements" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => loadTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Data Display */}
          {activeTab && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 capitalize">
                  {activeTab} Roster
                </h3>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">{tabData.length} Entries</span>
              </div>

              {tabLoading ? (
                <div className="py-8 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">Loading roster...</div>
              ) : tabData.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">No records found.</div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
                  <table className="w-full text-left border-collapse table-modern">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name / Identifier</th>
                        <th>Details</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                      {tabData.map((item, i) => (
                        <tr key={item._id || item.id || i} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/40">
                          <td className="font-mono text-xs text-slate-400 dark:text-slate-500">{i + 1}</td>
                          <td className="font-bold text-slate-900 dark:text-white text-xs">
                            {item.firstName ? `${item.firstName} ${item.lastName}` : item.name || item.title || "Record"}
                          </td>
                          <td className="text-xs text-slate-600 dark:text-slate-400">
                            {item.email || item.courseCode || item.content || item.department || "—"}
                          </td>
                          <td className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Active</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
