import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().min(5, "Campo obrigatório").toLowerCase(),
    password: z
        .string()
        .min(6, "Campo obrigatório")
        .max(20)
        .refine(password => /[A-Z]/.test(password))
        .refine(password => /[a-z]/.test(password))
        .refine(password => /\d/.test(password))
        .refine(password =>
            /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
        ),
})

export const addressSchema = z.object({
    cep: z.string(),
    street: z.string(),
    number: z.coerce.number(),
    complement: z.string().optional(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
})

export const cep = z.string().min(8).max(8)

export const clinicalDataSchema = z.object({
    cid: z.string(),
    covenant: z.string().optional(),
    expires: z.coerce.date().optional(),
    CNS: z.coerce.number().optional(),
    allegation: z.string(),
    diagnosis: z.string(),
})

export const adultResponsibleSchema = z
    .object({
        name: z.string(),
        cpf: z.string(),
        phone: z.string(),
        email: z.string().email(),
        address: addressSchema,
    })
    .optional()

export const createPatientSchema = z.object({
    name: z.string(),
    cpf: z.string(),
    dateOfBirth: z.coerce.date(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    sex: z.union([z.literal("Masculino"), z.literal("Feminino")]).optional(),
    profession: z.string().optional(),
    address: addressSchema,
    clinicalData: clinicalDataSchema,
    adultResponsible: adultResponsibleSchema,
})

export const patientListSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    cpf: z.string(),
    phone: z.string().nullable(),
    sex: z.union([z.literal("Masculino"), z.literal("Feminino")]).nullable(),
    appointments: z.array(
        z.object({
            status: z.union([
                z.literal("SOLICITADO"),
                z.literal("CONFIRMADO"),
                z.literal("CANCELADO"),
                z.literal("FINALIZADO"),
            ]),
            appointmentDate: z.coerce.date(),
            employee: z.object({
                name: z.string(),
            }),
        })
    ),
})
