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
    <div className="min-h-screen bg-black pt-16">
      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-72 flex items-center" style={{ backgroundImage: "url('/assets/football.svg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="relative z-10 px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase text-white leading-tight text-center">
            Admin <span className="text-yellow-300">Dashboard</span>
          </h1>
          <p className="mt-4 text-lg text-white max-w-xl text-center mx-auto">
            Welcome to the admin panel. Manage users, monitor revenue, and control platform content.
          </p>
        </div>
      </section>
      {/* Divider */}
      <div className="w-full h-6 bg-yellow-300" style={{ transform: 'skewY(-3deg)' }}></div>

      {/* Stats Section */}
      <section className="bg-yellow-300 py-12 px-8">
        <h2 className="text-3xl font-bold text-black mb-8 uppercase">Platform Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
            <span className="text-3xl font-extrabold text-black">123</span>
            <span className="text-gray-700 text-base mt-1">Total Users</span>
          </div>
          <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
            <span className="text-3xl font-extrabold text-yellow-400">$2,500</span>
            <span className="text-gray-700 text-base mt-1">Revenue (month)</span>
          </div>
          <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
            <span className="text-3xl font-extrabold text-black">8</span>
            <span className="text-gray-700 text-base mt-1">New Signups</span>
          </div>
          <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
            <span className="text-3xl font-extrabold text-yellow-400">2</span>
            <span className="text-gray-700 text-base mt-1">Pending Imports</span>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-6 bg-black" style={{ transform: 'skewY(3deg)' }}></div>

      {/* Navigation Section */}
      <section className="bg-black py-12 px-8">
        <h2 className="text-3xl font-bold text-yellow-300 mb-8 uppercase">Admin Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section) => (
            <button
              key={section.path}
              onClick={() => navigate(section.path)}
              className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-start hover:scale-[1.03] hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-yellow-300"
            >
              <span className="text-xl font-semibold text-black mb-2">{section.title}</span>
              <span className="text-gray-500 text-sm">{section.description}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard; 