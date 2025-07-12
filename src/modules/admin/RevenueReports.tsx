import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockTransactions = [
  { id: 1, date: "2024-06-01", user: "Ivan Ivanov", type: "Membership", amount: 5, status: "Paid" },
  { id: 2, date: "2024-06-02", user: "FC Dynamo", type: "Placement Fee", amount: 50, status: "Paid" },
  { id: 3, date: "2024-06-03", user: "Petr Petrov", type: "Membership", amount: 10, status: "Paid" },
  { id: 4, date: "2024-06-04", user: "FC Zenit", type: "Placement Fee", amount: 50, status: "Unpaid" },
];

const mockChartData = [5, 50, 10, 50];
const mockChartLabels = ["06-01", "06-02", "06-03", "06-04"];

const RevenueReports = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Фильтрация по дате
  const filtered = mockTransactions.filter(t => {
    const d = new Date(t.date).getTime();
    const fromD = from ? new Date(from).getTime() : -Infinity;
    const toD = to ? new Date(to).getTime() : Infinity;
    return d >= fromD && d <= toD;
  });

  // Сводка по категориям
  const totalMembership = filtered.filter(t => t.type === "Membership").reduce((sum, t) => sum + t.amount, 0);
  const totalPlacement = filtered.filter(t => t.type === "Placement Fee").reduce((sum, t) => sum + t.amount, 0);

  const exportCSV = () => {
    const header = "Date,User,Type,Amount,Status\n";
    const rows = filtered.map(t => `${t.date},${t.user},${t.type},${t.amount},${t.status}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "revenue-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Revenue Reports</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>
        {/* Фильтр по дате */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div>
            <label className="block text-sm text-gray-600 mb-1">From</label>
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={from}
              onChange={e => setFrom(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">To</label>
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={to}
              onChange={e => setTo(e.target.value)}
            />
          </div>
          <button
            onClick={exportCSV}
            className="self-end bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition"
          >
            Export CSV
          </button>
        </div>
        {/* Сводка */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-600">${totalMembership}</span>
            <span className="text-gray-500 text-sm mt-1">Candidate Memberships</span>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
            <span className="text-2xl font-bold text-green-600">${totalPlacement}</span>
            <span className="text-gray-500 text-sm mt-1">Placement Fees</span>
          </div>
        </div>
        {/* Мок-график (SVG bar chart) */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="font-semibold text-blue-700 mb-2">Revenue Trend</div>
          <svg width="100%" height="120" viewBox="0 0 320 120">
            {mockChartData.map((val, i) => (
              <rect
                key={i}
                x={20 + i * 70}
                y={120 - val * 2}
                width={40}
                height={val * 2}
                fill={i % 2 === 0 ? '#2563eb' : '#22c55e'}
                rx={8}
              />
            ))}
            {mockChartLabels.map((label, i) => (
              <text
                key={label}
                x={40 + i * 70}
                y={115}
                textAnchor="middle"
                fontSize="12"
                fill="#64748b"
              >
                {label}
              </text>
            ))}
          </svg>
        </div>
        {/* Таблица транзакций */}
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full bg-white rounded-xl">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">User/Team</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">No transactions found</td>
                </tr>
              )}
              {filtered.map(t => (
                <tr key={t.id} className="border-b last:border-b-0">
                  <td className="py-3 px-4">{t.date}</td>
                  <td className="py-3 px-4">{t.user}</td>
                  <td className="py-3 px-4">{t.type}</td>
                  <td className="py-3 px-4">${t.amount}</td>
                  <td className="py-3 px-4">
                    <span className={
                      t.status === "Paid"
                        ? "text-green-600 font-semibold"
                        : "text-red-500 font-semibold"
                    }>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueReports; 