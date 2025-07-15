import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthenticationService } from '../../api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await AuthenticationService.verifyEmailV1AuthVerifyEmailPost(email, Number(code));
      setSuccess(true);
      setTimeout(() => navigate('/payment'), 1200);
    } catch (err) {
      setError('Invalid code or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-5 flex flex-col items-center">
      <section className="w-full max-w-3xl mx-auto text-center py-10 relative">
        <h1 className="text-4xl md:text-6xl font-extrabold uppercase text-white leading-tight">
          Verify <span className="text-yellow-300">Email</span>
        </h1>
        <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
          Enter the 6-digit code sent to <span className="text-yellow-300 font-bold">{email}</span> to activate your account.
        </p>
      </section>
      <div className="w-full h-6 bg-yellow-300 mb-8" style={{ transform: 'skewY(-3deg)' }}></div>
      <div className="w-full max-w-md mb-16">
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-black font-semibold mb-2 text-lg text-center">Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                className="w-full border-2 border-yellow-300 rounded-lg px-6 py-4 text-2xl tracking-widest text-center bg-neutral-100 text-black placeholder-gray-400 font-mono"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                required
                placeholder="______"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold rounded-lg px-6 py-3 flex items-center justify-center transition disabled:opacity-50 text-lg"
              disabled={loading || code.length !== 6}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
            {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
            {success && <div className="text-green-600 text-center font-bold mt-2">Email verified! Redirecting...</div>}
          </form>
          {/* Тестовые кнопки для UI тестирования */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-bold rounded-lg px-6 py-3 flex items-center justify-center transition text-lg"
              onClick={() => {
                // Моковая регистрация + переход на оплату
                localStorage.setItem('access_token', 'mock_token');
                localStorage.setItem('current_user', JSON.stringify({
                  id: 1,
                  first_name: 'Anna',
                  last_name: 'Smirnova',
                  email: email || 'anna@example.com',
                  role: 'candidate',
                  is_active: true,
                  is_approved: true,
                  email_verified: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }));
                setSuccess(true);
                setTimeout(() => {
                  setSuccess(false);
                  navigate('/payment');
                }, 800);
              }}
            >
              Verify and Pay (Mock)
            </button>
            <button
              type="button"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg px-6 py-3 flex items-center justify-center transition text-lg"
              onClick={() => {
                // Моковая регистрация + оплата, сразу пускать на dashboard
                localStorage.setItem('access_token', 'mock_token');
                localStorage.setItem('current_user', JSON.stringify({
                  id: 2,
                  first_name: 'FC Example',
                  last_name: 'Team',
                  email: email || 'team@example.com',
                  role: 'team',
                  is_active: true,
                  is_approved: true,
                  email_verified: true,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                }));
                setSuccess(true);
                setTimeout(() => {
                  setSuccess(false);
                  navigate('/dashboard');
                }, 800);
              }}
            >
              Verify without Pay (Mock)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 