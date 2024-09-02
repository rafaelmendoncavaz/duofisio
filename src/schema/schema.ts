import { z } from "zod"

export const loginSchema = z.object({
  email: z.string()
    .min(5, "Campo obrigatório")
    .toLowerCase(),
  password: z.string()
    .min(6, "Campo obrigatório")
    .max(20)
    .refine(password => /[A-Z]/.test(password))
    .refine(password => /[a-z]/.test(password))
    .refine(password => /\d/.test(password))
    .refine(password => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
})