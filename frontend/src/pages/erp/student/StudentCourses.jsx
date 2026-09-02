import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/erp/students/me/courses")
      .then((res) => setCourses(res.data.data || []))
      .catch((err) => console.error("Error fetching courses:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading enrolled courses...</span>
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
              <Link to="/erp/student" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                &larr; Student Portal
              </Link>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Academic Curriculum</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Enrolled Courses
            </h1>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200/60 dark:border-slate-700 self-start sm:self-auto">
            {courses.length} Active Courses
          </span>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No Enrolled Courses Found</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">You are currently not enrolled in any course for this semester.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((c, i) => (
              <div key={i} className="card-panel p-6 space-y-4 hover:border-indigo-400 dark:hover:border-indigo-500">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800 px-2.5 py-1 rounded-lg">
                      {c.courseId?.courseCode || "CS-101"}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2.5 leading-snug">
                      {c.courseId?.name || "Course Title"}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                    {c.status || "Enrolled"}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {c.courseId?.description || "Comprehensive course covering fundamental theory, practical lab exercises, and continuous evaluations."}
                </p>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <div className="flex items-center gap-3">
                    <span>
                      Credits: <strong className="text-slate-900 dark:text-white">{c.courseId?.credits || 3}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Sem: <strong className="text-slate-900 dark:text-white">{c.courseId?.semester || 1}</strong>
                    </span>
                  </div>

                  {c.faculty && (
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      <span className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] flex items-center justify-center">
                        {c.faculty.firstName?.charAt(0)}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                        {c.faculty.firstName} {c.faculty.lastName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
