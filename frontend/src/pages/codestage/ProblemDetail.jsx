import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import api from "../../utils/api";

let MonacoEditor = null;

export default function ProblemDetail() {
  const { id } = useParams();
  const { theme } = useTheme();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    import("@monaco-editor/react")
      .then((mod) => {
        MonacoEditor = mod.default;
        setEditorReady(true);
      })
      .catch(() => setEditorReady(false));
  }, []);

  useEffect(() => {
    api.get(`/codestage/problems/${id}`)
      .then((res) => setProblem(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const res = await api.post("/codestage/submissions/run", { problemId: id, code, language });
      setOutput(res.data);
    } catch (err) {
      setOutput({ status: "Error", message: err.response?.data?.message || "Run execution failed" });
    } fienerally:
    setRunning(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setOutput(null);
    try {
      const res = await api.post("/codestage/submissions", { problemId: id, code, language });
      setOutput({ status: res.data.status, message: res.data.message || `Evaluation complete (Submission ID: ${res.data.submissionId})` });
    } catch (err) {
      setOutput({ status: "Error", message: err.response?.data?.message || "Submission evaluation failed" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Initializing CodeStage IDE...</span>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs font-bold">
          ⚠️ Problem statement not found.
        </div>
      </div>
    );
  }

  const monacoLang = { cpp: "cpp", java: "java", python: "python", javascript: "javascript", c: "c" };
  const difficultyBadge = {
    easy: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    medium: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    hard: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-[#0b0f19] p-4 lg:p-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link to="/codestage" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            &larr; Problem Directory
          </Link>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">CodeStage Playground</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* Left Pane: Problem Description */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6 max-h-[calc(100vh-140px)] overflow-y-auto">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${difficultyBadge[problem.difficulty?.toLowerCase()] || difficultyBadge.easy}`}>
                  {problem.difficulty}
                </span>
                {problem.tags?.map((t, idx) => (
                  <span key={idx} className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                    {t}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {problem.title}
              </h1>
            </div>

            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="prose dark:prose-invert max-w-none text-xs">
                <p className="whitespace-pre-line text-slate-800 dark:text-slate-200 font-medium">{problem.description}</p>
              </div>

              {problem.inputFormat && (
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Input Format:</h3>
                  <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 font-mono text-[11px] whitespace-pre-line">
                    {problem.inputFormat}
                  </p>
                </div>
              )}

              {problem.outputFormat && (
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Output Format:</h3>
                  <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 font-mono text-[11px] whitespace-pre-line">
                    {problem.outputFormat}
                  </p>
                </div>
              )}

              {problem.constraints && (
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Constraints:</h3>
                  <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    {problem.constraints}
                  </p>
                </div>
              )}

              {problem.sampleTestCases?.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[11px]">Sample Test Cases</h3>
                  {problem.sampleTestCases.map((tc, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2 font-mono text-[11px]">
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 font-bold block text-[10px] uppercase">Input:</span>
                        <pre className="text-slate-900 dark:text-white whitespace-pre-wrap">{tc.input}</pre>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 font-bold block text-[10px] uppercase">Output:</span>
                        <pre className="text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap">{tc.output}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Pane: Code Editor & Console */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              {/* Editor Header Bar */}
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python 3</option>
                    <option value="javascript">JavaScript</option>
                    <option value="c">C</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRun}
                    disabled={running || submitting}
                    className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {running ? (
                      <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin"></span>
                    ) : (
                      "► Run Code"
                    )}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={running || submitting}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {submitting ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      "Submit Code"
                    )}
                  </button>
                </div>
              </div>

              {/* Monaco Code Editor */}
              <div className="h-[360px] bg-[#1e1e1e]">
                {editorReady && MonacoEditor ? (
                  <MonacoEditor
                    height="100%"
                    language={monacoLang[language] || "cpp"}
                    theme={theme === "dark" ? "vs-dark" : "vs"}
                    value={code}
                    onChange={(val) => setCode(val || "")}
                    options={{
                      fontSize: 13,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 12 },
                    }}
                  />
                ) : (
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Write code here..."
                    className="w-full h-full p-4 font-mono text-xs bg-[#1e1e1e] text-slate-100 focus:outline-none resize-none"
                  />
                )}
              </div>
            </div>

            {/* Output Console */}
            {output && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 text-white shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Execution Output</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    output.status === "Accepted" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-rose-950 text-rose-400 border border-rose-800"
                  }`}>
                    {output.status || "Result"}
                  </span>
                </div>
                <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                  {output.message || JSON.stringify(output, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
