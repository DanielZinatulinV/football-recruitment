import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockUsers = [
  { id: 1, name: "Ivan Ivanov", email: "ivan@mail.com", type: "Candidate", status: "active" },
  { id: 2, name: "FC Dynamo", email: "dynamo@club.com", type: "Team", status: "active" },
  { id: 3, name: "Petr Petrov", email: "petr@mail.com", type: "Candidate", status: "suspended" },
  { id: 4, name: "FC Zenit", email: "zenit@club.com", type: "Team", status: "active" },
];

const UserManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [users, setUsers] = useState(mockUsers);

  const filtered = users.filter(u =>
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())) &&
    (type ? u.type === type : true)
  );

  const toggleStatus = (id: number) => {
    setUsers(users => users.map(u =>
      u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
    ));
  };

  const resetPassword = (id: number) => {
    alert("Password reset link sent (mock)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-700">User Management</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name or email"
            className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Candidate">Candidate</option>
            <option value="Team">Team</option>
          </select>
        </div>
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full bg-white rounded-xl">
            <thead>
              <tr className="bg-blue-100 text-blue-700">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">No users found</td>
                </tr>
              )}
              {filtered.map(user => (
                <tr key={user.id} className="border-b last:border-b-0">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.type}</td>
                  <td className="py-3 px-4">
                    <span className={
                      user.status === "active"
                        ? "text-green-600 font-semibold"
                        : "text-red-500 font-semibold"
                    }>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold"
                    >
                      {user.status === "active" ? "Suspend" : "Activate"}
                    </button>
                    <button
                      onClick={() => resetPassword(user.id)}
                      className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 text-xs font-semibold"
                    >
                      Reset Password
                    </button>
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

export default UserManagement; 