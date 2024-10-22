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
    cep: z
        .string()
        .min(8, "Insira o CEP do paciente")
        .max(8, "Somente números"),
    street: z.string().min(3, "Insira o nome da rua"),
    number: z.coerce.number().min(1, "Insira o número da casa"),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, "Insira o nome da região/bairro"),
    city: z.string(),
    state: z.string(),
})

export const cep = z.string().min(8).max(8)

export const clinicalDataSchema = z.object({
    cid: z.string().min(1, "Insira o código do CID"),
    covenant: z.string().optional(),
    expires: z.coerce.date().optional(),
    CNS: z.coerce.number().optional(),
    allegation: z.string().min(1, "Insira a queixa do paciente"),
    diagnosis: z.string(),
})

export const adultResponsibleSchema = z
    .object({
        name: z.string().min(3, "Insira o nome do responsável"),
        cpf: z.string().min(11, "O campo CPF do responsável é obrigatório"),
        phone: z.string().min(9, "Insira um número para contato válido"),
        email: z.string().email().min(7, "Insira um e-mail válido"),
        address: addressSchema,
    })
    .optional()

export const createPatientSchema = z.object({
    name: z.string().min(2, "Insira um nome para o paciente"),
    cpf: z
        .string()
        .min(11, "O campo CPF é obrigatório")
        .max(11, "Somente números"),
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
