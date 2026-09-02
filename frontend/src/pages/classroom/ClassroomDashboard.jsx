import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

export default function ClassroomDashboard() {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [form, setForm] = useState({ name: "", section: "", subject: "", description: "" });
  const [joinCode, setJoinCode] = useState("");

  const fetchClassrooms = async () => {
    try {
      const res = await api.get("/classroom/classrooms");
      setClassrooms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/classroom/classrooms", form);
      setShowCreate(false);
      setForm({ name: "", section: "", subject: "", description: "" });
      fetchClassrooms();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create classroom");
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      await api.post("/classroom/classrooms/join", { code: joinCode });
      setShowJoin(false);
      setJoinCode("");
      fetchClassrooms();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to join classroom");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This will remove all enrollments and posts.`)) return;
    try {
      await api.delete(`/classroom/classrooms/${id}`);
      fetchClassrooms();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading virtual classrooms...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 dark:bg-[#0b0f19] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Interactive Learning Hub
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Virtual Streams & Assignments</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {user?.role === "admin" ? "All Campus Classrooms" : "My Classrooms"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {(user?.role === "faculty" || user?.role === "admin") && (
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>+</span> Create Class
              </button>
            )}

            {user?.role === "student" && (
              <button
                onClick={() => setShowJoin(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🔑</span> Join with Code
              </button>
            )}
          </div>
        </div>

        {/* Classroom Grid */}
        {classrooms.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No Enrolled Classrooms</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.role === "student"
                ? "Click 'Join with Code' to enroll in a classroom."
                : "Click 'Create Class' to set up a classroom stream."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classrooms.map((cls) => (
              <div
                key={cls._id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:border-indigo-300 dark:hover:border-indigo-600 transition-all flex flex-col justify-between group"
              >
                {/* Banner Header */}
                <div
                  className="p-5 text-white relative space-y-3"
                  style={{ backgroundColor: cls.themeColor || "#3b82f6" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/20 text-white backdrop-blur-xs">
                      {cls.subject || "General"}
                    </span>
                    <span className="font-mono text-xs font-bold bg-black/30 px-2.5 py-0.5 rounded-md text-white">
                      {cls.code}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold truncate leading-snug">{cls.name}</h2>
                    {cls.section && (
                      <p className="text-xs opacity-90 font-medium">Section: {cls.section}</p>
                    )}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  {cls.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {cls.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Instructor: <strong>{cls.faculty_name || "Faculty"}</strong></span>
                    <span>{cls.student_count || 0} Enrolled</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="px-5 py-3 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    to={`/classroom/${cls._id}`}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>Enter Stream</span>
                    <span>&rarr;</span>
                  </Link>

                  {user?.role === "admin" && (
                    <button
                      onClick={() => handleDelete(cls._id, cls.name)}
                      className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Create Class */}
        {showCreate && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Virtual Classroom</h2>
              <form onSubmit={handleCreate} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Classroom Name *</label>
                  <input
                    required
                    placeholder="e.g. CS101 — Data Structures"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Section</label>
                    <input
                      placeholder="e.g. Sec A"
                      value={form.section}
                      onChange={(e) => setForm({ ...form, section: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                    <input
                      placeholder="e.g. Computer Science"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief course overview..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white font-bold text-xs shadow-xs"
                  >
                    Create Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Join Class */}
        {showJoin && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Join Classroom with Code</h2>
              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Classroom Code *</label>
                  <input
                    required
                    placeholder="e.g. A1B2C3"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Ask your instructor for the 6-character classroom code.</p>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowJoin(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs"
                  >
                    Join Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
