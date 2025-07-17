import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialAuthState } from "../initial/initial-auth";
import type { AuthStatus } from "../../shared/types/auth-status.type";
import type { OutUserSchema } from "../../api";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...initialAuthState,
    user: null as OutUserSchema | null,
    unreadMessagesCount: 0,
  },
  reducers: {
    setAuthStatus: (state, action: PayloadAction<AuthStatus>) => {
      state.authStatus = action.payload;
    },
    setUser: (state, action: PayloadAction<OutUserSchema>) => {
      state.user = action.payload;
      state.authStatus = "authenticated";
    },
    clearUser: (state) => {
      state.user = null;
      state.authStatus = "pending";
      state.unreadMessagesCount = 0;
    },
    setUnreadMessagesCount: (state, action: PayloadAction<number>) => {
      state.unreadMessagesCount = action.payload;
    },
    clearUnreadMessagesCount: (state) => {
      state.unreadMessagesCount = 0;
    },
    // Оставляем для совместимости, но теперь setCurrentUser не нужен
    setCurrentUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.authStatus = "authenticated";
    },
    clearCurrentUser: (state) => {
      state.user = null;
      state.authStatus = "pending";
    },
  },
});

export const { setAuthStatus, setUser, clearUser, setUnreadMessagesCount, clearUnreadMessagesCount, setCurrentUser, clearCurrentUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
