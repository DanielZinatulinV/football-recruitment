import { useMutation } from "@tanstack/react-query";
import { AuthenticationService } from "../../../api";
import type { TeamRegistrationSchema } from "../../../api/models/TeamRegistrationSchema";

const useRegisterTeam = () => {
  return useMutation({
    mutationFn: async (formData: TeamRegistrationSchema) => {
      // Реальный запрос на сервер
      return AuthenticationService.registerTeamV1AuthRegisterTeamPost(formData);
    },
  });
};

export default useRegisterTeam;
