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

// Criar Agendamento Clínico (alinhado com backend createAppointmentSchema)
export const createAppointmentSchema = z.object({
    appointmentDate: z.preprocess(
        val => (typeof val === "string" ? new Date(val).toISOString() : val),
        z.string().datetime()
    ),
    duration: z
        .number()
        .min(30, "A duração mínima é 30 minutos")
        .multipleOf(30, "A duração deve ser em intervalos de 30 minutos"),
    patientId: z.string().uuid("ID do paciente deve ser um UUID"),
    employeeId: z.string().uuid("ID do funcionário deve ser um UUID"),
    clinicalRecordId: z
        .string()
        .uuid("ID do registro clínico deve ser um UUID"),
})

// Buscar Agendamentos Filtrados (alinhado com backend getAppointmentsQuerySchema)
export const appointmentListSchema = z.object({
    status: z.union([
        z.literal("SOLICITADO"),
        z.literal("CONFIRMADO"),
        z.literal("CANCELADO"),
        z.literal("FINALIZADO"),
    ]),
    id: z.string().uuid("ID do agendamento deve ser um UUID"),
    appointmentDate: z.preprocess(
        val => (typeof val === "string" ? new Date(val).toISOString() : val),
        z.string().datetime()
    ),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    duration: z.number(),
    employee: z.object({
        name: z.string(),
        id: z.string().uuid("ID do funcionário deve ser um UUID"),
    }),
    patient: z.object({
        id: z.string().uuid("ID do paciente deve ser um UUID"),
        name: z.string(),
        phone: z.string().nullable(),
    }),
    appointmentReason: z.object({
        id: z.string().uuid(),
        cid: z.string(),
        allegation: z.string(),
        diagnosis: z.string(),
    }),
})

// Buscar Agendamento Específico (alinhado com backend getSinglePatientAppointments)
export const getSinglePatientAppointments = z.object({
    id: z.string().uuid("ID do agendamento deve ser um UUID"),
    appointmentDate: z.preprocess(
        val => (typeof val === "string" ? new Date(val).toISOString() : val),
        z.string().datetime()
    ),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    duration: z.number(),
    status: z.union([
        z.literal("SOLICITADO"),
        z.literal("CONFIRMADO"),
        z.literal("CANCELADO"),
        z.literal("FINALIZADO"),
    ]),
    employee: z.object({
        employeeName: z.string(),
        employeeId: z.string().uuid("ID do funcionário deve ser um UUID"),
    }),
    appointmentReason: z.object({
        id: z.string().uuid(),
        cid: z.string(),
        allegation: z.string(),
        diagnosis: z.string(),
    }),
    patient: z.object({
        name: z.string(),
        phone: z.string().nullable(),
        email: z.string().email().nullable(),
        patientId: z.string().uuid("ID do paciente deve ser um UUID"),
    }),
})

// Repetir Agendamento Específico (alinhado com backend repeatAppointmentSchema)
export const repeatAppointmentSchema = z.object({
    sessionCount: z.coerce
        .number()
        .min(1, "Deve haver pelo menos 1 sessão")
        .int("A quantidade de sessões deve ser um número inteiro"),
    daysOfWeek: z
        .array(
            z
                .number()
                .min(0)
                .max(
                    6,
                    "Os dias da semana devem ser de 0 a 6 (domingo a sábado)"
                )
        )
        .min(1, "Selecione pelo menos um dia da semana"),
})

// Atualizar Agendamento Específico (alinhado com backend updateAppointmentSchema)
export const updateAppointmentSchema = z.object({
    appointmentDate: z.preprocess(
        val => (typeof val === "string" ? new Date(val).toISOString() : val),
        z.string().datetime()
    ),
    duration: z
        .number()
        .min(30, "A duração mínima é 30 minutos")
        .multipleOf(30, "A duração deve ser em intervalos de 30 minutos")
        .optional(),
    status: z
        .union([
            z.literal("SOLICITADO"),
            z.literal("CONFIRMADO"),
            z.literal("CANCELADO"),
            z.literal("FINALIZADO"),
        ])
        .optional(),
    employeeId: z
        .string()
        .uuid("ID do funcionário deve ser um UUID")
        .optional(),
})
