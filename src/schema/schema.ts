import { z } from "zod"

// Login (alinhado com backend authLoginSchema)
export const loginSchema = z.object({
    email: z
        .string()
        .email("Insira um e-mail válido")
        .min(5, "Campo obrigatório"),
    password: z
        .string()
        .min(6, "Campo obrigatório")
        .max(20, "Máximo 20 caracteres"),
})

// Endereço (alinhado com backend addressSchema e ViaCEP)
export const addressSchema = z.object({
    cep: z.string().length(8, "CEP deve ter 8 dígitos"),
    street: z.string().min(3, "Insira o nome da rua"),
    number: z.coerce.number().min(1, "Insira o número da casa"),
    complement: z.string().nullable(), // Backend aceita null
    neighborhood: z.string().min(1, "Insira o nome da região/bairro"),
    city: z.string().min(1, "Insira a cidade"),
    state: z.string().length(2, "Insira a UF com 2 caracteres"), // UF como no Brasil
})

// CEP para ViaCEP
export const cep = z.string().length(8, "CEP deve ter 8 dígitos")

// Dados Clínicos (alinhado com backend clinicalDataSchema)
export const clinicalDataSchema = z.object({
    cid: z.string().min(1, "Insira o código do CID"),
    covenant: z.string().nullable(), // Nullable no backend
    expires: z.coerce.date().nullable(), // Nullable e coercível
    CNS: z.string().nullable(), // Nullable no backend
    allegation: z.string().min(1, "Insira a queixa do paciente"),
    diagnosis: z.string().min(1, "Forneça um diagnóstico"),
})

// Responsável Adulto (alinhado com backend statusPatientDataSchema.adultResponsible)
export const adultResponsibleSchema = z
    .object({
        name: z.string().min(3, "Insira o nome do responsável"),
        cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
        phone: z.string().min(9, "Insira um número de contato válido"),
        email: z.string().email("Insira um e-mail válido"),
        address: addressSchema,
    })
    .nullable() // Nullable no backend

// Criar Paciente (alinhado com backend createPatientSchema)
export const createPatientSchema = z.object({
    name: z.string().min(2, "Insira um nome para o paciente"),
    cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
    dateOfBirth: z.coerce.date(),
    phone: z.string().nullable(), // Nullable no backend
    email: z.string().email("Insira um e-mail válido").nullable(), // Nullable
    sex: z.enum(["Masculino", "Feminino"]).nullable(), // Enum nullable
    profession: z.string().nullable(), // Nullable
    address: addressSchema,
    clinicalData: clinicalDataSchema,
    adultResponsible: adultResponsibleSchema,
})

// Atualizar Paciente (alinhado com backend, mas parcial)
export const updatePatientSchema = z.object({
    name: z.string().min(2, "Insira um nome para o paciente").optional(),
    cpf: z.string().length(11, "CPF deve ter 11 dígitos").optional(),
    dateOfBirth: z.string().optional(),
    phone: z.string().nullable().optional(), // Nullable e opcional
    email: z.string().email("Insira um e-mail válido").nullable().optional(), // Nullable
    sex: z.enum(["Masculino", "Feminino"]).nullable().optional(), // Nullable
    profession: z.string().nullable().optional(), // Nullable
    address: addressSchema.optional(),
    adultResponsible: adultResponsibleSchema.optional(),
})

// Lista de Pacientes (alinhado com backend statusPatientListSchema)
export const patientListSchema = z.object({
    id: z.string().uuid("ID deve ser um UUID"),
    name: z.string(),
    cpf: z.string(),
    phone: z.string().nullable(), // Nullable no backend
    sex: z.enum(["Masculino", "Feminino"]).nullable(), // Nullable
    appointments: z.array(
        z.object({
            status: z.enum([
                "SOLICITADO",
                "CONFIRMADO",
                "CANCELADO",
                "FINALIZADO",
            ]),
            appointmentDate: z.coerce.date(), // Coercível do backend
            employee: z.object({
                name: z.string(),
            }),
        })
    ),
})

// Criar Registro Clínico (alinhado com backend createClinicalRecordSchema)
export const createRecordSchema = z.object({
    cid: z.string().min(1, "Insira o código do CID"),
    covenant: z.string().nullable(), // Nullable
    expires: z.coerce.date().nullable(), // Nullable
    allegation: z.string().min(1, "Insira a queixa do paciente"),
    diagnosis: z.string().min(1, "Forneça um diagnóstico"),
})
