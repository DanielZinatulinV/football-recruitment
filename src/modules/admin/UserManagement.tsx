import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AdminService } from '../../api';
import type { OutUserSchema } from '../../api';
import { OpenAPI } from '../../api/core/OpenAPI';

const UserManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [users, setUsers] = useState<OutUserSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalUser, setModalUser] = useState<OutUserSchema | null>(null);
  const [actionLoading, setActionLoading] = useState<{ [id: number]: boolean }>({});
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      OpenAPI.TOKEN = token;
    }
    setLoading(true);
    setError(null);
    AdminService.getAllUsersV1AdminUsersGet(100)
      .then(res => {
        setUsers(res.items);
        setLoading(false);
      })
      .catch(err => {
        setError(err?.body?.detail || err?.message || 'Failed to load users');
        setLoading(false);
      });
  }, []);

  const filtered = users.filter(u => {
    const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
    const email = u.email.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase());
    const matchesType = type ? (type === 'Candidate' ? u.role === 'candidate' : u.role === 'team') : true;
    return matchesSearch && matchesType;
  });

  // TODO: Implement real status toggle via API
  const toggleStatus = useCallback(async (user: OutUserSchema) => {
    setActionError(null);
    setActionLoading((prev) => ({ ...prev, [user.id]: true }));
    try {
      let updatedUser: OutUserSchema;
      if (user.is_active) {
        updatedUser = await AdminService.deactivateUserV1AdminUsersUserIdDeactivatePost(user.id);
      } else {
        updatedUser = await AdminService.activateUserV1AdminUsersUserIdActivatePost(user.id);
      }
      setUsers(users => users.map(u => u.id === user.id ? updatedUser : u));
    } catch (err: any) {
      setActionError(err?.body?.detail || err?.message || 'Failed to update user status');
    } finally {
      setActionLoading((prev) => ({ ...prev, [user.id]: false }));
    }
  }, []);

  const handleView = useCallback((user: OutUserSchema) => {
    setModalUser(user);
  }, []);
  const closeModal = () => setModalUser(null);

  return (
    <div className="min-h-screen bg-black pt-16 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-yellow-300 uppercase">User Management</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-yellow-300 hover:underline text-sm font-semibold"
          >
            ← Back to Dashboard
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name or email"
            className="border-2 border-yellow-300 rounded-lg px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-neutral-900 text-white placeholder-gray-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border-2 border-yellow-300 rounded-lg px-3 py-2 w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-neutral-900 text-white"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Candidate">Candidate</option>
            <option value="Team">Team</option>
          </select>
        </div>
        {loading && <div className="text-yellow-300 text-center py-8 text-lg font-bold">Loading users...</div>}
        {error && <div className="text-red-500 text-center py-8 text-lg font-bold">{error}</div>}
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full bg-white rounded-xl">
            <thead>
              <tr className="bg-yellow-100 text-yellow-700 uppercase text-sm">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && !error && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">No users found</td>
                </tr>
              )}
              {!loading && !error && filtered.map(user => (
                <tr key={user.id} className="border-b last:border-b-0">
                  <td className="py-3 px-4 text-black font-semibold">{user.first_name} {user.last_name}</td>
                  <td className="py-3 px-4 text-black">{user.email}</td>
                  <td className="py-3 px-4 text-black">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                  <td className="py-3 px-4">
                    <span className={
                      user.is_active
                        ? "text-yellow-500 font-semibold"
                        : "text-red-500 font-semibold"
                    }>
                      {user.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => toggleStatus(user)}
                      className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs font-semibold border border-yellow-300 disabled:opacity-60"
                      disabled={!!actionLoading[user.id]}
                    >
                      {actionLoading[user.id] ? (user.is_active ? 'Suspending...' : 'Activating...') : (user.is_active ? "Suspend" : "Activate")}
                    </button>
                    <button
                      onClick={() => handleView(user)}
                      className="px-3 py-1 rounded bg-white text-black hover:bg-yellow-100 text-xs font-semibold border border-yellow-300"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* User Details Modal */}
      {modalUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-yellow-300 text-2xl" onClick={closeModal}>&times;</button>
            <h2 className="text-2xl font-extrabold text-black mb-6 text-center uppercase">User Details</h2>
            <div className="space-y-2 text-black text-base">
              <div><b>Name:</b> {modalUser.first_name} {modalUser.last_name}</div>
              <div><b>Email:</b> {modalUser.email}</div>
              <div><b>Role:</b> {modalUser.role}</div>
              <div><b>Status:</b> {modalUser.is_active ? 'Active' : 'Suspended'}</div>
              <div><b>Approved:</b> {modalUser.is_approved ? 'Yes' : 'No'}</div>
              <div><b>Email Verified:</b> {modalUser.email_verified ? 'Yes' : 'No'}</div>
              <div><b>Created At:</b> {new Date(modalUser.created_at).toLocaleString()}</div>
              <div><b>Updated At:</b> {new Date(modalUser.updated_at).toLocaleString()}</div>
              {modalUser.position && <div><b>Position:</b> {modalUser.position}</div>}
              {modalUser.experience_level && <div><b>Experience Level:</b> {modalUser.experience_level}</div>}
              {modalUser.qualification && <div><b>Qualification:</b> {modalUser.qualification}</div>}
              {modalUser.location && <div><b>Location:</b> {modalUser.location}</div>}
              {modalUser.club_name && <div><b>Club Name:</b> {modalUser.club_name}</div>}
              {modalUser.contact_phone && <div><b>Contact Phone:</b> {modalUser.contact_phone}</div>}
            </div>
            <div className="flex justify-end mt-6">
              <button className="px-6 py-2 rounded bg-yellow-300 text-black font-bold hover:bg-yellow-400 transition" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
      {actionError && <div className="text-red-500 text-center py-4 text-base font-bold">{actionError}</div>}
    </div>
  );
};

export default UserManagement; 