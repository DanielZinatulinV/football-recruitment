import type { Auth } from "../../shared/types/auth.type";
import { getLocalUser } from "../../shared/utils/get-local-user.util";

export const initialAuthState: Auth = {
  currentUser: getLocalUser(), // токены, если нужно
  user: null, // профиль пользователя
  authStatus: 'pending',
};
