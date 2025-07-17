import CandidateDashboard from './CandidateDashboard';
import TeamDashboard from '../teams/TeamDashboard';
import AdminDashboard from '../admin/AdminDashboard';
import { useMemo } from 'react';

export default function Dashboard() {
  // Если user невалидный (например, ngrok-страница), пробуем взять из localStorage
  const effectiveUser = useMemo(() => {
    try {
      const local = localStorage.getItem('current_user');
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && parsed.role) return parsed;
      }
    } catch {}
    return null;
  }, []);

  if (!effectiveUser) return null;

  if (effectiveUser.role === 'candidate') return <CandidateDashboard />;
  if (effectiveUser.role === 'team') return <TeamDashboard />;
  if (effectiveUser.role === 'admin') return <AdminDashboard />;
  return <div className="min-h-screen flex items-center justify-center bg-black text-yellow-300 text-2xl font-bold">Unknown role: {effectiveUser.role}</div>;
} 