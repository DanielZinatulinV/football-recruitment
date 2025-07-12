import { useMutation } from "@tanstack/react-query";
import type { TeamRegisterSchema } from "../../../schemas/team.schema";

const TEAM_PROFILE_KEY = "team_profile";

const useRegisterTeam = () => {
  return useMutation({
    mutationFn: async (formData: TeamRegisterSchema) => {
      // Сохраняем профиль команды в localStorage
      localStorage.setItem(TEAM_PROFILE_KEY, JSON.stringify(formData));
      // Мокаем задержку и успешный ответ
      return new Promise((resolve) => setTimeout(() => resolve(formData), 300));
    },
  });
};

export default useRegisterTeam;
