import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

export default function ClassroomDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [classroom, setClassroom] = useState(null);
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState({ faculty: null, students: [] });
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("feed"); // "feed" | "people"

  const [showCreate, setShowCreate] = useState(false);
  const [postForm, setPostForm] = useState({ title: "", content: "", type: "material" });
  const [file, setFile] = useState(null);

  const fetchData = async () => {
    try {
      const [clsRes, postsRes, peopleRes] = await Promise.all([
        api.get(`/classroom/classrooms/${id}`),
        api.get(`/classroom/posts/${id}`),
        api.get(`/classroom/classrooms/${id}/people`),
      ]);
      setClassroom(clsRes.data);
      setPosts(postsRes.data);
      setPeople(peopleRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("classroom_id", id);
      formData.append("title", postForm.title);
      formData.append("content", postForm.content);
      formData.append("type", postForm.type);
      if (file) {
        if (file.size > 10 * 1024 * 1024) return alert("File size must be under 10MB");
        formData.append("file", file);
      }

      await api.post("/classroom/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowCreate(false);
      setPostForm({ title: "", content: "", type: "material" });
      setFile(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create post");
    }
  };

  const handleStudentSubmit = async (postId, uploadFile) => {
    if (!uploadFile) return;
    if (uploadFile.size > 10 * 1024 * 1024) return alert("File size must be under 10MB");

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      await api.post(`/classroom/posts/${postId}/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Assignment submitted successfully!");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit assignment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading classroom stream...</span>
        </div>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs font-bold">
          ⚠️ Classroom not found or access denied.
        </div>
      </div>
    );
  }

  const postBadge = {
    assignment: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    announcement: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    material: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-[#0b0f19] py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link to="/classroom" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            &larr; Back to Classrooms
          </Link>
        </div>

        {/* Hero Banner */}
        <div
          className="rounded-2xl p-6 sm:p-8 text-white shadow-xs space-y-4 relative overflow-hidden"
          style={{ backgroundColor: classroom.themeColor || "#1e293b" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/20 text-white backdrop-blur-xs">
              {classroom.subject || "Course Stream"}
            </span>
            <span className="font-mono text-xs font-bold px-3 py-1 rounded-md bg-black/30 text-white border border-white/20">
              Code: {classroom.code}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {classroom.name}
            </h1>
            <p className="text-xs sm:text-sm opacity-90 font-medium mt-1">
              {classroom.section ? `Section ${classroom.section}` : "Main Stream"}
            </p>
          </div>

          <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs opacity-90">
            <span>Instructor: <strong>{classroom.faculty_name}</strong></span>
            <span>{classroom.student_count || 0} Students Enrolled</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs max-w-xs">
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "feed"
                ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Stream Feed
          </button>
          <button
            onClick={() => setActiveTab("people")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "people"
                ? "bg-slate-900 dark:bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            People ({people.students.length + (people.faculty ? 1 : 0)})
          </button>
        </div>

        {/* Tab 1: Stream Feed */}
        {activeTab === "feed" && (
          <div className="space-y-6">
            {/* Create Post Action for Faculty */}
            {(user?.role === "faculty" || user?.role === "admin") && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Post to Stream</h3>
                  <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition-colors"
                  >
                    {showCreate ? "Cancel Post" : "+ Create Post"}
                  </button>
                </div>

                {showCreate && (
                  <form onSubmit={handleCreatePost} className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Post Type</label>
                        <select
                          value={postForm.type}
                          onChange={(e) => setPostForm({ ...postForm, type: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="material">Study Material</option>
                          <option value="assignment">Assignment</option>
                          <option value="announcement">Announcement</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Post Title</label>
                        <input
                          required
                          placeholder="e.g. Assignment 1: Array Operations"
                          value={postForm.title}
                          onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Instructions / Description</label>
                      <textarea
                        rows={3}
                        placeholder="Write assignment instructions or stream notes..."
                        value={postForm.content}
                        onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Attach Document (Optional, max 10MB)</label>
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-300 hover:file:bg-slate-200 dark:hover:file:bg-slate-700 cursor-pointer"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow-xs cursor-pointer"
                      >
                        Publish Post
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Posts Roster */}
            {posts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Stream is Empty</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Course materials and announcements will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post._id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${postBadge[post.type] || postBadge.material}`}>
                          {post.type}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        By {post.author_name}
                      </span>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{post.title}</h2>
                      {post.content && (
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60 whitespace-pre-line">
                          {post.content}
                        </p>
                      )}
                    </div>

                    {post.fileUrl && (
                      <div>
                        <a
                          href={post.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span>{post.fileName || "Download Attachment"}</span>
                        </a>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span>{post.comment_count || 0} Stream Comments</span>

                      {post.type === "assignment" && user?.role === "student" && (
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            id={`file-${post._id}`}
                            className="hidden"
                            onChange={(e) => handleStudentSubmit(post._id, e.target.files[0])}
                          />
                          <label
                            htmlFor={`file-${post._id}`}
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                          >
                            Submit Assignment
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: People Roster */}
        {activeTab === "people" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
                <h2 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Instructor</h2>
                {people.faculty ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold text-sm flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                      {people.faculty.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{people.faculty.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{people.faculty.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">Instructor profile unassigned.</p>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Enrolled Students ({people.students.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse table-modern">
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {people.students.map((student, i) => (
                        <tr key={student.id || i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="w-10 font-mono text-xs font-bold text-slate-400 dark:text-slate-500">{i + 1}</td>
                          <td>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">{student.name}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">{student.email}</div>
                          </td>
                          <td className="text-right text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                            Joined {student.joined_at ? new Date(student.joined_at).toLocaleDateString() : "Active"}
                          </td>
                        </tr>
                      ))}
                      {people.students.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center py-6 text-xs text-slate-500 dark:text-slate-400">
                            No students enrolled yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
