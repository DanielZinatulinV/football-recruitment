import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticationService } from '../../api';
import { OpenAPI } from '../../api';

const CANDIDATE_PROFILE_KEY = "candidate_profile";
const TEAM_PROFILE_KEY = "team_profile";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'candidate' | 'team'>('candidate');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = await AuthenticationService.loginV1AuthLoginPost({
        username: email,
        password,
      });
      localStorage.setItem('access_token', token.access_token);
      OpenAPI.TOKEN = token.access_token;
      // Получить профиль
      const user = await AuthenticationService.readUsersMeV1AuthMeGet();
      localStorage.setItem('current_user', JSON.stringify(user));
      setLoading(false);
      if (user.role === 'candidate') {
        navigate("/candidate/dashboard");
      } else if (user.role === 'team') {
        navigate("/team/dashboard");
      } else {
        setError("Unknown user role.");
      }
    } catch (err: any) {
      setError(err?.body?.detail || err?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-5 flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-3xl mx-auto text-center py-10 relative">
        <h1 className="text-4xl md:text-6xl font-extrabold uppercase text-white leading-tight">
          Sign in to <span className="text-yellow-300">Football</span> Network
        </h1>
        <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
          Login as a <span className="text-yellow-300 font-bold">Candidate</span> or <span className="text-yellow-300 font-bold">Team</span> to access your dashboard and opportunities in sport.
        </p>
      </section>
      {/* Decorative Divider */}
      <div className="w-full h-6 bg-yellow-300 mb-8" style={{ transform: 'skewY(-3deg)' }}></div>

      {/* Role Switcher Card */}
      <div className="mb-8 flex items-center gap-4 bg-white rounded-xl shadow-lg px-8 py-4">
        <button
          className={`px-6 py-2 rounded-lg font-bold uppercase transition text-lg ${role === 'candidate' ? 'bg-yellow-300 text-black shadow' : 'bg-white text-gray-700 border border-black'}`}
          onClick={() => setRole('candidate')}
        >
          Candidate
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-bold uppercase transition text-lg ${role === 'team' ? 'bg-yellow-300 text-black shadow' : 'bg-white text-gray-700 border border-black'}`}
          onClick={() => setRole('team')}
        >
          Team
        </button>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-2xl mb-16">
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-black font-semibold mb-1">Email</label>
              <input
                id="email"
                type="email"
                className="w-full border-2 border-yellow-300 rounded-lg px-3 py-2 focus:outline-none bg-neutral-100 text-black placeholder-gray-400"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-black font-semibold mb-1">Password</label>
              <input
                id="password"
                type="password"
                className="w-full border-2 border-yellow-300 rounded-lg px-3 py-2 focus:outline-none bg-neutral-100 text-black placeholder-gray-400"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold rounded-lg px-6 py-3 flex items-center justify-center transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
          </form>
          <div className="mt-8 text-center text-sm text-gray-500">
            {role === 'candidate' ? (
              <>
                Don’t have a candidate account?{' '}
                <button
                  className="text-yellow-400 hover:underline font-bold"
                  onClick={() => navigate("/candidate/register")}
                >
                  Register as candidate
                </button>
              </>
            ) : (
              <>
                Don’t have a team account?{' '}
                <button
                  className="text-yellow-400 hover:underline font-bold"
                  onClick={() => navigate("/team/register")}
                >
                  Register your team
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;