import { z } from "zod";

export const candidateSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  position: z.string().min(1, "Please select a role"),
  experience: z.string().min(1, "Please select experience"),
  skills: z.string().optional(),
  cv: z.any().refine((file) => file instanceof File || file === null, {
    message: "CV must be a file",
  }),
  selectedPlan: z.enum(["basic", "premium", "professional"]).optional(),
  paymentStatus: z.enum(["paid", "unpaid"]).optional(),
});

export type CandidateFormData = z.infer<typeof candidateSchema>;
