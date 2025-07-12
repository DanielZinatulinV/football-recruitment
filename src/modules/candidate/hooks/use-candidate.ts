import { useMutation } from "@tanstack/react-query";
import type { CandidateFormData } from "../../../schemas/candidate.schema";
import { AuthenticationService, UserRole } from "../../../api";

const useRegisterCandidate = () => {
  return useMutation({
    mutationFn: async (formData: CandidateFormData) => {
      const payload: any = {
        first_name: formData.firstName || '',
        last_name: formData.lastName || '',
        email: formData.email || '',
        password: formData.password || '',
        role: UserRole.CANDIDATE,
        position: formData.position || undefined,
        experience_level: formData.experience || undefined,
        qualification: formData.skills || undefined,
      };
      if ('location' in formData && formData.location) {
        payload.location = formData.location;
      }
      if ('birthdate' in formData && formData.birthdate) {
        payload.birthdate = formData.birthdate;
      }
      return await AuthenticationService.registerCandidateV1AuthRegisterCandidatePost(payload);
    },
  });
};

export default useRegisterCandidate;