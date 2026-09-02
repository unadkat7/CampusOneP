import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";

export default function StudentFees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/erp/students/me/fees")
      .then((res) => setFees(res.data.data || []))
      .catch((err) => console.error("Error fetching fee details:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading fee records...</span>
        </div>
      </div>
    );
  }

  const totalFee = fees.reduce((acc, f) => acc + (f.totalAmount || 0), 0);
  const totalPaid = fees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
  const totalPending = Math.max(0, totalFee - totalPaid);

  const statusBadge = {
    paid: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    partial: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    unpaid: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
    pending: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  };

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
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Financial Accounts</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Fee Records & Invoices
            </h1>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total Billed</span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">₹{totalFee.toLocaleString()}</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total Paid</span>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">₹{totalPaid.toLocaleString()}</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Outstanding Balance</span>
            <span className={`text-xl font-extrabold mt-1 block ${totalPending > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}>
              ₹{totalPending.toLocaleString()}
            </span>
          </div>
        </div>

        {fees.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No Invoices Found</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Fee statements will appear here once generated by the accounts department.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-modern">
                <thead>
                  <tr>
                    <th>Semester</th>
                    <th>Description</th>
                    <th>Total Amount</th>
                    <th>Amount Paid</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {fees.map((f, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="font-bold text-slate-900 dark:text-white text-xs">Semester {f.semester || 1}</td>
                      <td className="text-xs text-slate-700 dark:text-slate-300 font-medium">{f.title || "Tuition & Academic Fees"}</td>
                      <td className="text-xs font-bold text-slate-900 dark:text-white">₹{(f.totalAmount || 0).toLocaleString()}</td>
                      <td className="text-xs font-bold text-emerald-600 dark:text-emerald-400">₹{(f.paidAmount || 0).toLocaleString()}</td>
                      <td className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {f.dueDate ? new Date(f.dueDate).toLocaleDateString() : "Immediate"}
                      </td>
                      <td>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge[f.status?.toLowerCase()] || statusBadge.pending}`}>
                          {f.status || "Pending"}
                        </span>
                      </td>
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
