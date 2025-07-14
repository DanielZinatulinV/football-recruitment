import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticationService } from '../../api';
import { VacanciesService } from '../../api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [vacanciesResult, setVacanciesResult] = useState<string | null>(null);
  const [vacanciesLoading, setVacanciesLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 1. Логин через API
      const token = await AuthenticationService.loginV1AuthLoginPost({
        username: email,
        password,
      });
      localStorage.setItem('access_token', token.access_token);
      // 2. Получить профиль
      const user = await AuthenticationService.readUsersMeV1AuthMeGet();
      if (user.role !== 'admin') {
        setError('You are not an admin.');
        setLoading(false);
        return;
      }
      localStorage.setItem('current_user', JSON.stringify(user));
      setLoading(false);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err?.body?.detail || err?.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleTestVacancies = async () => {
    setVacanciesResult(null);
    setVacanciesLoading(true);
    try {
      const data = await VacanciesService.listVacanciesV1VacanciesGet();
      setVacanciesResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setVacanciesResult('Error: ' + (err?.body?.detail || err?.message || 'Request failed'));
    } finally {
      setVacanciesLoading(false);
    }
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
        <button
          type="button"
          className="mt-6 w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold rounded-lg px-6 py-3 flex items-center justify-center transition text-lg"
          onClick={handleTestVacancies}
          disabled={vacanciesLoading}
        >
          {vacanciesLoading ? 'Testing Vacancies API...' : 'Test Vacancies API'}
        </button>
        {vacanciesResult && (
          <pre className="mt-4 bg-gray-100 rounded p-3 text-xs overflow-x-auto max-h-60">{vacanciesResult}</pre>
        )}
      </div>
    </div>
  );
};

export default AdminLogin; 