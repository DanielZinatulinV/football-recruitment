import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticationService } from '../../api';
import type { OutUserSchema } from '../../api';

export function useAuth() {
  const [user, setUser] = useState<OutUserSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await AuthenticationService.readUsersMeV1AuthMeGet();
        setUser(data);
      } catch (err: any) {
        setUser(null);
        setError('Не авторизован');
        localStorage.removeItem('access_token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

  return { user, loading, error };
} 