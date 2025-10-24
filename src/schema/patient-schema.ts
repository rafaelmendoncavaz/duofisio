import { z } from "zod";
import {
    addressSchema,
    adultResponsibleSchema,
    clinicalDataSchema,
} from "./schema";

// Criar Paciente (alinhado com backend createPatientSchema)
export const createPatientSchema = z.object({
    name: z.string().min(2, "Insira um nome para o paciente"),
    cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
    dateOfBirth: z.coerce.date(),
    phone: z.string().nullable(), // Nullable no backend
    email: z.string().email("Insira um e-mail válido").nullable().optional(), // Nullable
    sex: z.enum(["Masculino", "Feminino"]).nullable(), // Enum nullable
    profession: z.string().nullable(), // Nullable
    address: addressSchema,
    clinicalData: clinicalDataSchema,
    adultResponsible: adultResponsibleSchema,
});

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
});

// Lista de Pacientes (alinhado com backend statusPatientListSchema)
export const patientListSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    cpf: z.string(),
    phone: z.string().nullable(),
    sex: z.union([z.literal("Masculino"), z.literal("Feminino")]).nullable(),
    appointments: z.array(
        z.object({
            id: z.string().uuid(),
            totalSessions: z.number(),
            sessions: z.array(
                z.object({
                    id: z.string().uuid(),
                    status: z.union([
                        z.literal("SOLICITADO"),
                        z.literal("CONFIRMADO"),
                        z.literal("CANCELADO"),
                        z.literal("FINALIZADO"),
                    ]),
                    appointmentDate: z.date(),
                })
            ),
            employee: z.object({
                name: z.string(),
            }),
        })
    ),
});

export const patientDataSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    cpf: z.string(),
    dateOfBirth: z.coerce.date(),
    phone: z.string().nullable(),
    email: z.string().email().nullable(),
    sex: z.union([z.literal("Masculino"), z.literal("Feminino")]).nullable(),
    profession: z.string().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    address: addressSchema,
    adultResponsible: adultResponsibleSchema,
    clinicalData: z.array(clinicalDataSchema),
    appointments: z.array(
        z.object({
            id: z.string().uuid(),
            createdAt: z.date(),
            updatedAt: z.date(),
            totalSessions: z.number(),
            clinicalRecord: z.object({
                cid: z.string(),
                allegation: z.string(),
                diagnosis: z.string(),
            }),
            sessions: z.array(
                z.object({
                    id: z.string().uuid(),
                    appointmentDate: z.date(),
                    status: z.union([
                        z.literal("SOLICITADO"),
                        z.literal("CONFIRMADO"),
                        z.literal("CANCELADO"),
                        z.literal("FINALIZADO"),
                    ]),
                    duration: z.number(),
                    sessionNumber: z.number(),
                    progress: z.string().optional().nullable(),
                })
            ),
        })
    ),
});
