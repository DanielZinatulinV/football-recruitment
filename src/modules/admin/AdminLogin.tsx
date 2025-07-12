import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_PROFILE_KEY = "admin_profile";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Мок-проверка по localStorage
    // const saved = localStorage.getItem(ADMIN_PROFILE_KEY);
    const saved = {
      email: "admin@example.com",
      password: "admin123"
    };
    if (!saved) {
      setError("No admin registered with this email.");
      setLoading(false);
      return;
    }
    // const admin = JSON.parse(saved);
    const admin = saved;
    if (admin.email !== email) {
      setError("No admin registered with this email.");
      setLoading(false);
      return;
    }
    if (admin.password !== password) {
      setError("Incorrect password.");
      setLoading(false);
      return;
    }
    // Успешный вход — переход на Admin Dashboard (заглушка)
    setTimeout(() => {
      setLoading(false);
      navigate("/admin/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              className="text-blue-600 hover:underline text-sm"
              onClick={() => navigate("/admin/password-reset")}
            >
              Forgot password?
            </button>
          </div>
          {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 