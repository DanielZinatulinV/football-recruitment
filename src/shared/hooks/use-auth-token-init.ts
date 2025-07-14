import { OpenAPI } from "../../api/core/OpenAPI";

const token = localStorage.getItem('access_token');
if (token) {
  OpenAPI.TOKEN = token;
}

export function useAuthTokenInit() {
  // intentionally left blank for compatibility
} 