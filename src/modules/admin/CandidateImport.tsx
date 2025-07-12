import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const REQUIRED_FIELDS = ["name", "email", "experience"];

const CandidateImport = () => {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);
  const [summary, setSummary] = useState<null | { success: number; failed: number; errors: string[] }>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Мок-обработка файла
  const handleFile = (file: File) => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      // Мок: если имя файла содержит "fail" — ошибки, иначе успех
      if (file.name.includes("fail")) {
        setSummary({ success: 2, failed: 2, errors: ["Row 3: Missing email", "Row 5: Invalid experience"] });
      } else {
        setSummary({ success: 4, failed: 0, errors: [] });
      }
      setLoading(false);
    }, 1200);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || (ext !== "csv" && ext !== "xlsx")) {
      setError("Accepted formats: CSV or XLSX");
      return;
    }
    handleFile(file);
  };

  const downloadErrorReport = () => {
    // Мок-скачивание отчета
    const blob = new Blob([
      "Row,Error\n3,Missing email\n5,Invalid experience"
    ], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "import-errors.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Import Candidates</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>
        <div className="bg-white rounded-xl shadow p-8 mb-6">
          <label className="block text-gray-700 font-medium mb-2">Upload CSV or Excel file</label>
          <input
            ref={fileInput}
            type="file"
            accept=".csv,.xlsx"
            className="mb-4"
            onChange={onFileChange}
            disabled={loading}
          />
          <button
            type="button"
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition disabled:opacity-60"
            onClick={() => fileInput.current?.click()}
            disabled={loading}
          >
            {loading ? "Importing..." : "Select File"}
          </button>
          {error && <div className="text-red-500 text-sm mt-3">{error}</div>}
        </div>
        {summary && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-3 text-blue-700">Import Summary</h2>
            <div className="mb-2">Successfully imported: <span className="font-bold text-green-700">{summary.success}</span></div>
            <div className="mb-2">Failed: <span className="font-bold text-red-600">{summary.failed}</span></div>
            {summary.errors.length > 0 && (
              <div className="mb-2">
                <div className="font-semibold text-red-600 mb-1">Errors:</div>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {summary.errors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
                <button
                  onClick={downloadErrorReport}
                  className="mt-3 bg-red-100 text-red-700 px-4 py-1 rounded hover:bg-red-200 text-xs font-semibold"
                >
                  Download Error Report
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateImport; 