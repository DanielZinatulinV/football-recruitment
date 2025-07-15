import { useEffect } from 'react';
import { useAppDispatch } from '../../redux/store';
import { setUser, clearUser } from '../../redux/slices/auth.slice';
import { AuthenticationService, OpenAPI } from '../../api';

export function useAuthReduxInit() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      dispatch(clearUser());
      return;
    }
    OpenAPI.TOKEN = token;
    AuthenticationService.readUsersMeV1AuthMeGet()
      .then(user => {
        dispatch(setUser(user));
      })
      .catch(() => {
        dispatch(clearUser());
      });
  }, [dispatch]);
} 