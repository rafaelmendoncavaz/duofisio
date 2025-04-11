import { z } from "zod"

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
    totalSessions: z
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
        .optional(),
    patientId: z.string().uuid("ID do paciente deve ser um UUID"),
    employeeId: z.string().uuid("ID do funcionário deve ser um UUID"),
    clinicalRecordId: z
        .string()
        .uuid("ID do registro clínico deve ser um UUID"),
})

// Buscar Agendamentos Filtrados (alinhado com backend statusGetAppointmentsSchema)
export const appointmentListSchema = z.object({
    id: z.string().uuid("ID do agendamento deve ser um UUID"),
    totalSessions: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    patient: z.object({
        id: z.string().uuid("ID do paciente deve ser um UUID"),
        name: z.string(),
        phone: z.string().nullable(),
    }),
    employee: z.object({
        name: z.string(),
        id: z.string().uuid(),
    }),
    appointmentReason: z.object({
        id: z.string().uuid(),
        cid: z.string(),
        allegation: z.string(),
        diagnosis: z.string(),
    }),

    sessions: z.array(
        z.object({
            id: z.string().uuid("ID da sessão deve ser um UUID"),
            status: z.union([
                z.literal("SOLICITADO"),
                z.literal("CONFIRMADO"),
                z.literal("CANCELADO"),
                z.literal("FINALIZADO"),
            ]),
            sessionNumber: z.number(),
            appointmentDate: z.string(),
            duration: z.number(),
            progress: z.string().nullable(),
        })
    ),
})

// Buscar Agendamento Específico (alinhado com backend getSinglePatientAppointments)
export const getSinglePatientAppointments = z.object({
    id: z.string().uuid("ID do agendamento deve ser um UUID"),
    appointmentDate: z.string(),
    duration: z.number(),
    status: z.union([
        z.literal("SOLICITADO"),
        z.literal("CONFIRMADO"),
        z.literal("CANCELADO"),
        z.literal("FINALIZADO"),
    ]),
    sessionNumber: z.number(),
    progress: z.string().nullable(),
    appointment: z.object({
        id: z.string().uuid("ID do agendamento deve ser um UUID"),
        totalSessions: z.number(),
        createdAt: z.date(),
        updatedAt: z.date(),
        patient: z.object({
            patientId: z.string().uuid("ID do paciente deve ser um UUID"),
            name: z.string(),
            phone: z.string().nullable(),
            email: z.string().email().nullable(),
        }),
        employee: z.object({
            employeeId: z.string().uuid("ID do funcionário deve ser um UUID"),
            employeeName: z.string(),
        }),
        appointmentReason: z.object({
            id: z.string().uuid(),
            cid: z.string(),
            allegation: z.string(),
            diagnosis: z.string(),
        }),
    }),
})

// Repetir Agendamento Específico (alinhado com backend repeatAppointmentSchema)
export const repeatAppointmentSchema = z.object({
    totalSessions: z.coerce
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
    appointmentDate: z
        .preprocess(
            val =>
                typeof val === "string" ? new Date(val).toISOString() : val,
            z.string().datetime({ message: "Formato de data inválido" })
        )
        .optional(),
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
    progress: z.string().nullable().optional(),
    employeeId: z
        .string()
        .uuid("ID do funcionário deve ser um UUID")
        .optional(),
})
