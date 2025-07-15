import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticationService } from '../../api';
import { VacanciesService } from '../../api';
import type { OutUserSchema } from '../../api';
import { OpenAPI } from '../../api';
import { request as __request } from '../../api/core/request';
import { useAppDispatch } from '../../redux/store';
import { setUser } from '../../redux/slices/auth.slice';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
      OpenAPI.TOKEN = token.access_token;
      // 2. Получить профиль
      // Получить профиль с ngrok-skip-browser-warning
      const user = await __request(OpenAPI, {
        method: 'GET',
        url: '/v1/auth/me',
        headers: { 'ngrok-skip-browser-warning': 'true' },
      }) as OutUserSchema;
      if (user.role !== 'admin') {
        setError('You are not an admin.');
        setLoading(false);
        return;
      }
      localStorage.setItem('current_user', JSON.stringify(user));
      dispatch(setUser(user)); // <--- Добавлено: диспатч профиля в Redux
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
      // Custom request with ngrok header
      const data = await __request(OpenAPI, {
        method: 'GET',
        url: '/v1/vacancies',
        headers: { 'ngrok-skip-browser-warning': 'true' },
        errors: { 422: 'Validation Error' },
      });
      setVacanciesResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setVacanciesResult('Error: ' + (err?.body?.detail || err?.message || 'Request failed'));
    } finally {
      setVacanciesLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-3xl font-extrabold text-center text-black mb-8 uppercase tracking-wide">Admin <span className="text-yellow-300">Login</span></h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-black font-semibold mb-2 text-lg">Email</label>
            <input
              id="email"
              type="email"
              className="w-full border-2 border-yellow-300 rounded-lg px-6 py-4 text-lg bg-neutral-100 text-black placeholder-gray-400 font-mono"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="Enter your admin email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-black font-semibold mb-2 text-lg">Password</label>
            <input
              id="password"
              type="password"
              className="w-full border-2 border-yellow-300 rounded-lg px-6 py-4 text-lg bg-neutral-100 text-black placeholder-gray-400 font-mono"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="text-red-500 text-center font-semibold text-base mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold rounded-lg px-6 py-3 flex items-center justify-center transition text-lg mt-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
          <button
            type="button"
            className="w-full mt-3 bg-black text-yellow-300 border-2 border-yellow-300 font-bold rounded-lg px-6 py-3 flex items-center justify-center transition text-lg hover:bg-yellow-300 hover:text-black"
            onClick={handleTestVacancies}
            disabled={vacanciesLoading}
          >
            {vacanciesLoading ? 'Testing Vacancies API...' : 'Test Vacancies API'}
          </button>
          {vacanciesResult && (
            <pre className="mt-4 bg-neutral-100 rounded p-3 text-xs overflow-x-auto max-h-60 border border-yellow-200">{vacanciesResult}</pre>
          )}
          <div className="flex justify-end mt-2">
            <button
              type="button"
              className="text-yellow-400 hover:underline text-sm font-semibold"
              onClick={() => navigate("/admin/password-reset")}
            >
              Forgot password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 