import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

export default function Problems() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const fetchProblems = () => {
    api.get("/codestage/problems")
      .then((res) => setProblems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete problem "${title}"? This will also remove all submissions.`)) return;
    try {
      await api.delete(`/codestage/problems/${id}`);
      fetchProblems();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete problem");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading problem set...</span>
        </div>
      </div>
    );
  }

  const difficultyBadge = {
    easy: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    medium: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    hard: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  };

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = difficultyFilter === "all" || p.difficulty?.toLowerCase() === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 dark:bg-[#0b0f19] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 dark:bg-indigo-600 text-white border border-slate-700 dark:border-indigo-500">
                CodeStage IDE
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">LeetCode Style Practice</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Problem Directory
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/codestage/profile"
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-all flex items-center gap-1.5"
            >
              <span>📊</span> Developer Profile
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/codestage/problems/new"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>+</span> Add Problem
              </Link>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search problem title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <svg className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {["all", "easy", "medium", "hard"].map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  difficultyFilter === diff
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Problem Set Table */}
        {filteredProblems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No Problems Match Filter</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Try adjusting your search term or difficulty category.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-modern">
                <thead>
                  <tr>
                    <th className="w-12">Status</th>
                    <th className="w-12">#</th>
                    <th>Problem Title</th>
                    <th>Difficulty</th>
                    {user?.role === "admin" && <th className="text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredProblems.map((p, i) => (
                    <tr key={p._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td>
                        {p.isSolved ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold" title="Solved">
                            ✓
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 font-mono text-xs">•</span>
                        )}
                      </td>
                      <td className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">{i + 1}</td>
                      <td>
                        <Link
                          to={`/codestage/problems/${p._id}`}
                          className="font-bold text-slate-900 dark:text-white text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          {p.title}
                        </Link>
                        {p.tags?.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1">
                            {p.tags.map((tag, idx) => (
                              <span key={idx} className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${difficultyBadge[p.difficulty?.toLowerCase()] || difficultyBadge.easy}`}>
                          {p.difficulty}
                        </span>
                      </td>
                      {user?.role === "admin" && (
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => navigate(`/codestage/problems/${p._id}/edit`)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(p._id, p.title)}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
