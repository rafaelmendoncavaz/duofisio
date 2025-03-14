import type { z } from "zod"
import type {
    addressSchema,
    appointmentListSchema,
    cep,
    createAppointmentSchema,
    createPatientSchema,
    createRecordSchema,
    getSinglePatientAppointments,
    loginSchema,
    patientListSchema,
    repeatAppointmentSchema,
    updateAppointmentSchema,
    updatePatientSchema,
} from "../schema/schema"

// Tipos inferidos dos schemas Zod
export type TypeLoginData = z.infer<typeof loginSchema>
export type TypeCreatePatient = z.infer<typeof createPatientSchema>
export type TypeUpdatePatient = z.infer<typeof updatePatientSchema>
export type TypePatientList = z.infer<typeof patientListSchema>
export type TypeCep = z.infer<typeof cep>
export type AddressSchema = z.infer<typeof addressSchema>
export type TypeCreateRecord = z.infer<typeof createRecordSchema>
export type TypeCreateAppointment = z.infer<typeof createAppointmentSchema>
export type TypeAppointment = z.infer<typeof getSinglePatientAppointments>
export type TypeAppointmentRepeat = z.infer<typeof repeatAppointmentSchema>
export type TypeAppointmentUpdate = z.infer<typeof updateAppointmentSchema>
export type TypeAppointmentList = z.infer<typeof appointmentListSchema>

// Tipo do retorno da API ViaCEP
export interface TypeAddress {
    bairro: string
    cep: string
    complemento: string
    ddd: string
    estado: string
    gia: string
    ibge: string
    localidade: string
    logradouro: string
    regiao: string
    siafi: string
    uf: string
    unidade: string
}

// ClinicalData (alinhado com schema.prisma e /dashboard/patients/:id/clinical)
export interface ClinicalData {
    id: string // UUID
    cid: string
    covenant: string | null // Nullable no backend
    expires: string | null // Date como string (ISO) no JSON, nullable
    CNS: string | null // Nullable
    allegation: string
    diagnosis: string
    patientId?: string
}

// AdultResponsible (alinhado com schema.prisma e statusPatientDataSchema)
export interface AdultResponsible {
    id: string // UUID
    name: string
    cpf: string
    phone: string
    email: string
    address: AddressSchema
}

// Appointments (alinhado com schema.prisma e statusPatientDataSchema)
export interface Appointments {
    id: string // UUID
    appointmentDate: string // ISO string
    status: "SOLICITADO" | "CONFIRMADO" | "CANCELADO" | "FINALIZADO" // Enum do backend
    createdAt: string // ISO string
    updatedAt: string // ISO string
}

// TypePatient (alinhado com statusPatientDataSchema de GET /dashboard/patients/:id)
export interface TypePatient {
    id: string // UUID
    name: string
    cpf: string
    dateOfBirth: string // ISO string
    email: string | null // Nullable
    phone: string | null // Nullable
    sex: "Masculino" | "Feminino" | null // Enum nullable
    profession: string | null // Nullable
    createdAt: string // ISO string
    updatedAt: string // ISO string
    address: AddressSchema
    clinicalData: ClinicalData[]
    adultResponsible: AdultResponsible | null // Nullable no backend
    appointments: Appointments[]
}

// TypeClinicalRecord (alinhado com resposta de GET /dashboard/patients/:id/clinical)
export interface TypeClinicalRecord {
    patientName: string
    patientId: string // UUID
    clinicalRecordList: ClinicalData[]
}

// Modal
export interface Modal {
    closeModal: () => void
    isCreatePatientModalOpen: boolean
    isSinglePatientModalOpen: boolean
    isSingleAppointmentModalOpen: boolean
    openCreatePatientModal: () => void
    openSinglePatientModal: () => void
    openSingleAppointmentModal: () => void
}

// SearchFilter
export interface SearchFilter {
    searchName: string
    searchPhone: string
    searchCPF: string
    setSearchName: (name: string) => void
    setSearchPhone: (phone: string) => void
    setSearchCPF: (cpf: string) => void
}

// QueryFilter
export interface QueryFilter {
    filter?: "today" | "tomorrow" | "week" | "month"
    startDate?: string
    endDate?: string
}

export interface TypeAPI {
    // Estados
    error: string | null
    token: string | null // Token é string ou null
    user: {
        id: string // UUID do backend
        name: string
        appointments: {
            id: string
            patient: { id: string; name: string }
            status: "SOLICITADO" | "CONFIRMADO" | "CANCELADO" | "FINALIZADO"
            appointmentDate: string
        }[]
    } | null // Reflete o retorno de /auth/verify
    employees:
        | {
              name: string
              id: string
          }[]
        | null

    // Armazenamento de Requisições
    patientList: TypePatientList[]
    patientData: TypePatient | null
    clinicalRecords: {
        clinicalRecordList: ClinicalData[]
        patientName: string
        patientId: string
    } | null // Reflete o retorno de /dashboard/patients/:id/clinical
    clinicalRecord: ClinicalData | null
    appointmentList: TypeAppointmentList[] | null
    appointmentData: TypeAppointment | null

    // Funções de limpeza
    clearRecords: () => void
    clearRecord: () => void
    clearAppointment: () => void
    clearError: () => void
    clearToken: () => void

    // Funções assíncronas
    userLogin: (
        loginData: TypeLoginData
    ) => Promise<{ success: boolean; error?: unknown }>
    verifyAuth: () => Promise<{
        success: boolean
        user?: TypeAPI["user"]
        employees?: TypeAPI["employees"]
        error?: unknown
    }>
    createPatient: (data: TypeCreatePatient) => Promise<{
        success: boolean
        patientId?: string
        status?: number
        error?: unknown
    }>
    getPatients: () => Promise<{ success: boolean; error?: unknown }>
    getSinglePatient: (
        id: string
    ) => Promise<{ success: boolean; patient?: TypePatient; error?: unknown }>
    updatePatient: (
        data: TypeUpdatePatient,
        id: string
    ) => Promise<{ success: boolean; status?: number; error?: unknown }>
    deletePatient: (
        id: string
    ) => Promise<{ success: boolean; error?: unknown }>
    createClinicalRecord: (
        id: string,
        data: TypeCreateRecord
    ) => Promise<{ success: boolean; error?: unknown }>
    getClinicalRecords: (
        id: string
    ) => Promise<{ success: boolean; error?: unknown }>
    getSingleClinicalRecord: (
        id: string,
        recordId: string
    ) => Promise<{ success: boolean; record?: ClinicalData; error?: unknown }>
    deleteClinicalRecord: (
        id: string,
        recordId: string
    ) => Promise<{ success: boolean; error?: unknown }>
    createAppointment: (data: TypeCreateAppointment) => Promise<{
        success: boolean
        appointmentId?: string
        status?: number
        error?: unknown
    }>
    getAppointments: (
        filterParams?: QueryFilter
    ) => Promise<{ success: boolean; error?: unknown }>
    getSingleAppointment: (appointmentId: string) => Promise<{
        success: boolean
        appointment?: TypeAppointment
        error?: unknown
    }>
    repeatAppointment: (
        data: TypeAppointmentRepeat,
        appointmentId: string
    ) => Promise<{
        success: boolean
        appointmentIds?: string[]
        error?: unknown
    }>
    updateAppointment: (
        data: TypeAppointmentUpdate,
        appointmentId: string
    ) => Promise<{ success: boolean; status?: number; error?: unknown }>
    deleteAppointment: (
        appointmentId: string
    ) => Promise<{ success: boolean; status?: number; error?: unknown }>
}
