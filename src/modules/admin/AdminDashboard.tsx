import { useNavigate } from "react-router-dom";

const sections = [
  {
    title: "User Management",
    description: "View, search, suspend, or reset user accounts.",
    path: "/admin/users",
  },
  {
    title: "Candidate Import",
    description: "Bulk upload candidates via CSV/Excel.",
    path: "/admin/import",
  },
  {
    title: "Revenue Reports",
    description: "View revenue, filter by date, export CSV.",
    path: "/admin/revenue",
  },
  {
    title: "Terms & Privacy",
    description: "Edit terms of service and privacy policy.",
    path: "/admin/terms",
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">Admin Dashboard</h1>
        {/* Сводка */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-600">123</span>
            <span className="text-gray-500 text-sm mt-1">Total Users</span>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
            <span className="text-2xl font-bold text-green-600">$2,500</span>
            <span className="text-gray-500 text-sm mt-1">Revenue (month)</span>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-600">8</span>
            <span className="text-gray-500 text-sm mt-1">New Signups</span>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center">
            <span className="text-2xl font-bold text-green-600">2</span>
            <span className="text-gray-500 text-sm mt-1">Pending Imports</span>
          </div>
        </div>
        {/* Навигация по разделам */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <button
              key={section.path}
              onClick={() => navigate(section.path)}
              className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-start hover:scale-[1.03] hover:shadow-xl transition cursor-pointer border border-transparent hover:border-blue-400"
            >
              <span className="text-xl font-semibold text-blue-700 mb-2">{section.title}</span>
              <span className="text-gray-500 text-sm">{section.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 