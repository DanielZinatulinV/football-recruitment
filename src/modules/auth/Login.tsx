import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticationService } from '../../api';
import { OpenAPI } from '../../api';

const TEAM_PROFILE_KEY = "team_profile";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Добавим функцию для логина кандидата
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await AuthenticationService.loginV1AuthLoginPost({
        username: email,
        password: password,
      });
      // Сохраняем токен в localStorage
      localStorage.setItem('access_token', response.access_token);
      // Настраиваем OpenAPI на автоматическую подстановку токена
      OpenAPI.TOKEN = async () => localStorage.getItem('access_token') || '';
      // TODO: редирект или обновление состояния авторизации
    } catch (error: any) {
      // TODO: обработка ошибок (например, показать сообщение пользователю)
      console.error('Ошибка логина:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Мок-проверка по localStorage
    const saved = localStorage.getItem(TEAM_PROFILE_KEY);
    if (!saved) {
      setError("No team registered with this email.");
      setLoading(false);
      return;
    }
    const team = JSON.parse(saved);
    if (team.email !== email) {
      setError("No team registered with this email.");
      setLoading(false);
      return;
    }
    if (team.password !== password) {
      setError("Incorrect password.");
      setLoading(false);
      return;
    }
    // Успешный вход — переход на Team Dashboard (заглушка)
    setTimeout(() => {
      setLoading(false);
      navigate("/team/dashboard");
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Team Login</h1>
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
              onClick={() => navigate("/team/password-reset")}
            >
              Forgot password?
            </button>
          </div>
          {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Don’t have a team account?{' '}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => navigate("/team/register")}
          >
            Register your team
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;