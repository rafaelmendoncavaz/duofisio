import { z } from "zod";

export const createEmployeeSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8, "Insira ao menos 8 caracteres"),
    isAdmin: z.preprocess((val) => {
            if (val === "true") return true;
            if (val === "false") return false;
        }, z.boolean()),
});

export const updateEmployeeSchema = z.object({
    email: z
        .string()
        .transform((val) => (val.trim() === "" ? undefined : val))
        .optional()
        .refine((val) => !val || z.string().email().safeParse(val).success, {
            message: "E-mail inválido",
  }),
    password: z
        .string()
        .transform((val) => (val.trim() === "" ? undefined : val))
        .refine((val) => !val || val.length >= 8, {
            message: "Insira ao menos 8 caracteres",
        })
        .optional(),
    isAdmin: z
        .preprocess((val) => {
            if (val === "true") return true;
            if (val === "false") return false;
            return undefined;
        }, z.boolean().optional()),
});