import type { CurrentUser } from "../../schemas/current-user.schema";
import type { AuthStatus } from "./auth-status.type";
import type { OutUserSchema } from "../../api";

export interface Auth {
  currentUser: CurrentUser | null; // токены
  user: OutUserSchema | null; // профиль пользователя
  authStatus: AuthStatus;
}
