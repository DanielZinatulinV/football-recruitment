import { useAuth } from '../../shared/hooks/use-auth';
import CandidateDashboard from './CandidateDashboard';
import TeamDashboard from '../teams/TeamDashboard';
import AdminDashboard from '../admin/AdminDashboard';
import { useMemo } from 'react';

export default function Dashboard() {
  const { user, loading, error } = useAuth();

  // Если user невалидный (например, ngrok-страница), пробуем взять из localStorage
  const effectiveUser = useMemo(() => {
    if (user && typeof user === 'object' && user.role && typeof user.role === 'string') {
      return user;
    }
    try {
      const local = localStorage.getItem('current_user');
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && parsed.role) return parsed;
      }
    } catch {}
    return null;
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-yellow-300 text-2xl font-bold">Loading...</div>;
  if (error && !effectiveUser) return <div className="min-h-screen flex items-center justify-center bg-black text-red-500 text-2xl font-bold">{error}</div>;
  if (!effectiveUser) return null;

  if (effectiveUser.role === 'candidate') return <CandidateDashboard />;
  if (effectiveUser.role === 'team') return <TeamDashboard />;
  if (effectiveUser.role === 'admin') return <AdminDashboard />;
  return <div className="min-h-screen flex items-center justify-center bg-black text-yellow-300 text-2xl font-bold">Unknown role: {effectiveUser.role}</div>;
} 