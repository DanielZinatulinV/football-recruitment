import { useAuth } from '../../shared/hooks/use-auth';
import CandidateDashboard from './CandidateDashboard';
import TeamDashboard from '../teams/TeamDashboard';

export default function Dashboard() {
  const { user, loading, error } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-yellow-300 text-2xl font-bold">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center bg-black text-red-500 text-2xl font-bold">{error}</div>;
  if (!user) return null;

  if (user.role === 'candidate') return <CandidateDashboard />;
  if (user.role === 'team') return <TeamDashboard />;
  return <div className="min-h-screen flex items-center justify-center bg-black text-yellow-300 text-2xl font-bold">Unknown role: {user.role}</div>;
} 