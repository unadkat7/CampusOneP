import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";

export default function MarkAttendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Fetch faculty courses
    api.get("/erp/faculty/me/courses")
      .then((res) => {
        const list = res.data.data || [];
        setCourses(list);
        if (list.length > 0 && list[0].courseId) {
          setSelectedCourse(list[0].courseId._id);
        }
      })
      .catch(console.error);

    // Mock enrolled student roster for quick demo marking
    const sampleStudents = [
      { _id: "s1", name: "Aarav Patel", enrollmentNo: "CS2024001" },
      { _id: "s2", name: "Diya Sharma", enrollmentNo: "CS2024002" },
      { _id: "s3", name: "Vivaan Gupta", enrollmentNo: "CS2024003" },
      { _id: "s4", name: "Ananya Iyer", enrollmentNo: "CS2024004" },
      { _id: "s5", name: "Rohit Mehra", enrollmentNo: "CS2024005" },
    ];
    setStudents(sampleStudents);

    // Default all to Present
    const initialMap = {};
    sampleStudents.forEach((s) => (initialMap[s._id] = "present"));
    setAttendanceMap(initialMap);
  }, []);

  const handleToggle = (studentId) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : "present",
    }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach((s) => (updated[s._id] = status));
    setAttendanceMap(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }, 800);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-[#0b0f19] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Link to="/erp/faculty" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                &larr; Faculty Portal
              </Link>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Session Register</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Mark Student Attendance
            </h1>
          </div>
        </div>

        {/* Configuration Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Lecture Session Setup
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {courses.length > 0 ? (
                  courses.map((c, i) => (
                    <option key={i} value={c.courseId?._id}>
                      {c.courseId?.courseCode} — {c.courseId?.name}
                    </option>
                  ))
                ) : (
                  <option value="">CS301 — Database Management Systems</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Session Date</label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* Student Register Table */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Student Roster</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Click individual status badges to toggle attendance.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleMarkAll("present")}
                className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll("absent")}
                className="px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors"
              >
                Mark All Absent
              </button>
            </div>
          </div>

          {submitted && (
            <div className="mx-5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <span>✓</span> Attendance registered successfully for date {sessionDate}.
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-modern">
              <thead>
                <tr>
                  <th className="w-12">#</th>
                  <th>Enrollment ID</th>
                  <th>Student Name</th>
                  <th className="text-right">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {students.map((s, i) => {
                  const isPresent = attendanceMap[s._id] === "present";
                  return (
                    <tr key={s._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="font-mono text-xs text-slate-400 dark:text-slate-500">{i + 1}</td>
                      <td className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">{s.enrollmentNo}</td>
                      <td className="text-xs font-bold text-slate-900 dark:text-white">{s.name}</td>
                      <td className="text-right">
                        <button
                          type="button"
                          onClick={() => handleToggle(s._id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                            isPresent
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                              : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100"
                          }`}
                        >
                          {isPresent ? "✓ Present" : "✗ Absent"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              {submitting ? "Submitting Register..." : "Submit Attendance Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
