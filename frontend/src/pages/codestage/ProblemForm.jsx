import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";

export default function ProblemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  const [form, setForm] = useState({
    title: "",
    difficulty: "easy",
    description: "",
    constraints: "",
    tags: "",
    sampleInput: "",
    sampleOutput: "",
    testCases: [{ input: "", output: "", isHidden: false }],
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/codestage/problems/${id}`)
        .then((res) => {
          const p = res.data;
          setForm({
            title: p.title || "",
            difficulty: p.difficulty || "easy",
            description: p.description || "",
            constraints: p.constraints || "",
            tags: (p.tags || []).join(", "),
            sampleInput: p.sampleInput || "",
            sampleOutput: p.sampleOutput || "",
            testCases: p.testCases?.length > 0
              ? p.testCases.map((tc) => ({ input: tc.input, output: tc.output, isHidden: tc.isHidden || false }))
              : [{ input: "", output: "", isHidden: false }],
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const addTestCase = () => {
    setForm({ ...form, testCases: [...form.testCases, { input: "", output: "", isHidden: false }] });
  };

  const removeTestCase = (idx) => {
    if (form.testCases.length <= 1) return alert("At least one test case is required");
    setForm({ ...form, testCases: form.testCases.filter((_, i) => i !== idx) });
  };

  const updateTestCase = (idx, field, value) => {
    const updated = [...form.testCases];
    updated[idx][field] = value;
    setForm({ ...form, testCases: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        difficulty: form.difficulty,
        description: form.description,
        constraints: form.constraints,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        sampleInput: form.sampleInput,
        sampleOutput: form.sampleOutput,
        testCases: form.testCases,
      };

      if (isEdit) {
        await api.put(`/codestage/problems/${id}`, payload);
        alert("Problem updated successfully!");
      } else {
        await api.post("/codestage/problems", payload);
        alert("Problem created successfully!");
      }
      navigate("/codestage");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save problem");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500">Loading problem editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Link to="/codestage" className="text-xs font-bold text-indigo-600 hover:underline">
                &larr; Problem Directory
              </Link>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">Problem Creator</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              {isEdit ? "Edit Problem Specifications" : "Create New Coding Problem"}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Problem Metadata</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Problem Title *</label>
              <input
                required
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Valid Parentheses"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty Level *</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (Comma Separated)</label>
                <input
                  placeholder="e.g. array, stack, string"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Problem Description *</label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Write clear problem statement and requirements..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Constraints</label>
              <textarea
                rows={2}
                value={form.constraints}
                onChange={(e) => setForm({ ...form, constraints: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                placeholder="e.g. 1 <= s.length <= 10^4"
              />
            </div>
          </div>

          {/* Sample I/O Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Sample Demonstration</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sample Input</label>
                <textarea
                  rows={3}
                  value={form.sampleInput}
                  onChange={(e) => setForm({ ...form, sampleInput: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sample Output</label>
                <textarea
                  rows={3}
                  value={form.sampleOutput}
                  onChange={(e) => setForm({ ...form, sampleOutput: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          {/* Test Cases Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Evaluation Test Cases ({form.testCases.length})
              </h2>
              <button
                type="button"
                onClick={addTestCase}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                + Add Test Case
              </button>
            </div>

            <div className="space-y-4">
              {form.testCases.map((tc, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Test Case #{idx + 1}</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tc.isHidden}
                          onChange={(e) => updateTestCase(idx, "isHidden", e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Hidden Test Case</span>
                      </label>
                      {form.testCases.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTestCase(idx)}
                          className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Input</label>
                      <textarea
                        required
                        rows={2}
                        value={tc.input}
                        onChange={(e) => updateTestCase(idx, "input", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expected Output</label>
                      <textarea
                        required
                        rows={2}
                        value={tc.output}
                        onChange={(e) => updateTestCase(idx, "output", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-mono text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/codestage")}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
            >
              {saving ? "Saving Problem..." : isEdit ? "Update Problem" : "Create Problem"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
