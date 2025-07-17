import CandidateDashboard from './CandidateDashboard';
import TeamDashboard from '../teams/TeamDashboard';
import AdminDashboard from '../admin/AdminDashboard';
import { useAppSelector } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, authStatus } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      navigate('/login');
    }
  }, [authStatus, navigate]);

  if (authStatus === 'pending') {
    return <div className="min-h-screen flex items-center justify-center bg-black text-yellow-300 text-2xl font-bold">Loading...</div>;
  }

  if (!user) return null;

  if (user.role === 'candidate') return <CandidateDashboard />;
  if (user.role === 'team') return <TeamDashboard />;
  if (user.role === 'admin') return <AdminDashboard />;
  return <div className="min-h-screen flex items-center justify-center bg-black text-yellow-300 text-2xl font-bold">Unknown role: {user.role}</div>;
} 