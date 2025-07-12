import { z } from "zod";

export const teamSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  teamName: z.string().min(1, "Name is required"),
  website: z.string().url({ message: "Invalid website URL" }),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  logo: z.any().refine((file) => file instanceof File || file === null, {
    message: "Logo must be a file",
  }),
});

// Для редактирования профиля пароль не обязателен
export const teamEditSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().optional(),
  teamName: z.string().min(1, "Name is required"),
  website: z.string().url({ message: "Invalid website URL" }),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  logo: z.any().refine((file) => file instanceof File || file === null, {
    message: "Logo must be a file",
  }),
});

export type TeamRegisterSchema = z.infer<typeof teamSchema>;
export type TeamEditSchema = z.infer<typeof teamEditSchema>;
