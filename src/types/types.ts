import type { z } from "zod";
import type {
    addressSchema,
    appointmentListSchema,
    cep,
    createAppointmentSchema,
    createPatientSchema,
    createRecordSchema,
    getSinglePatientAppointments,
    loginSchema,
    patientDataSchema,
    patientListSchema,
    repeatAppointmentSchema,
    updateAppointmentSchema,
    updatePatientSchema,
} from "../schema/schema";

// Tipos inferidos dos schemas Zod
export type TypeLoginData = z.infer<typeof loginSchema>;
export type TypeCreatePatient = z.infer<typeof createPatientSchema>;
export type TypeUpdatePatient = z.infer<typeof updatePatientSchema>;
export type TypePatientList = z.infer<typeof patientListSchema>;
export type TypePatient = z.infer<typeof patientDataSchema>;
export type TypeCep = z.infer<typeof cep>;
export type AddressSchema = z.infer<typeof addressSchema>;
export type TypeCreateRecord = z.infer<typeof createRecordSchema>;
export type TypeCreateAppointment = z.infer<typeof createAppointmentSchema>;
export type TypeSession = z.infer<typeof getSinglePatientAppointments>;
export type TypeAppointmentRepeat = z.infer<typeof repeatAppointmentSchema>;
export type TypeAppointmentUpdate = z.infer<typeof updateAppointmentSchema>;
export type TypeAppointmentList = z.infer<typeof appointmentListSchema>;

// ClinicalData (alinhado com schema.prisma e /dashboard/patients/:id/clinical)
export interface ClinicalData {
    id: string; // UUID
    cid: string;
    covenant: string | null; // Nullable no backend
    expires: string | null; // Date como string (ISO) no JSON, nullable
    CNS: string | null; // Nullable
    allegation: string;
    diagnosis: string;
    patientId?: string;
}

// TypeClinicalRecord (alinhado com resposta de GET /dashboard/patients/:id/clinical)
export interface TypeClinicalRecord {
    patientName: string;
    patientId: string; // UUID
    clinicalRecordList: ClinicalData[];
}

// PatientFilter
export interface TypeSearchFilter {
    searchName: string;
    searchPhone: string;
    searchCPF: string;
    setSearchName: (name: string) => void;
    setSearchPhone: (phone: string) => void;
    setSearchCPF: (cpf: string) => void;
}

export interface TypeUser {
    id: string;
    name: string;
    appointments: {
        id: string;
        totalSessions: number;
        patient: { id: string; name: string };
        clinicalRecord: { cid: string };
        sessions: {
            id: string;
            sessionNumber: number;
            appointmentDate: string;
            duration: number;
            status: "SOLICITADO" | "CONFIRMADO" | "CANCELADO" | "FINALIZADO";
        }[];
    }[];
}

// Modal
export interface TypeModal {
    closeModal: () => void;
    isCreatePatientModalOpen: boolean;
    isSinglePatientModalOpen: boolean;
    isSingleAppointmentModalOpen: boolean;
    isFilterByTimespanModalOpen: boolean;
    openCreatePatientModal: () => void;
    openSinglePatientModal: () => void;
    openSingleAppointmentModal: () => void;
    openFilterByTimespanModal: () => void;
}

export interface TypeAPI {
    // Estados
    error: string | null;
    csrfToken: string | null;
    user: TypeUser | null; // Reflete o retorno de /auth/verify
    employees: { name: string; id: string }[] | null;
    activeFilter: "history" | "today" | "tomorrow" | "week" | "month" | null;
    startDate: string | number | Date;
    endDate: string | number | Date;
    currentWeek: string | number | Date;
    currentMonth: string | number | Date;

    // Armazenamento de Requisições
    patientList: TypePatientList[];
    patientData: TypePatient | null;
    clinicalRecords: TypeClinicalRecord | null;
    clinicalRecord: ClinicalData | null;
    appointmentList: TypeAppointmentList[] | null;
    filteredAppointments: TypeAppointmentList[] | null;
    selectedAppointmentData: TypePatient["appointments"][0] | null;
    sessionData: TypeSession | null;

    // Funções de controle de estado
    setCsrfToken: (csrfToken: string) => void;
    setSelectedAppointmentData: (
        appointment: TypePatient["appointments"][0]
    ) => void;
    clearSelectedAppointmentData: () => void;
    setActiveFilter: (filter: TypeAPI["activeFilter"]) => void;
    setDateRangeFilter: (
        startDate: TypeAPI["startDate"],
        endDate: TypeAPI["endDate"]
    ) => void;
    prevWeek: () => void;
    nextWeek: () => void;
    prevMonth: () => void;
    nextMonth: () => void;

    // Funções de limpeza
    clearRecords: () => void;
    clearRecord: () => void;
    clearAppointment: () => void;
    clearError: () => void;

    // Funções assíncronas
    userLogin: (
        loginData: TypeLoginData
    ) => Promise<{ success: boolean; error?: unknown }>;
    userLogout: () => Promise<{ success: boolean; error?: unknown }>;
    verifyAuth: () => Promise<{
        success: boolean;
        user?: TypeUser;
        employees?: TypeAPI["employees"];
        error?: unknown;
    }>;
    getCsrfToken: () => Promise<string | null>;
    createPatient: (data: TypeCreatePatient) => Promise<{
        success: boolean;
        patientId?: string;
        status?: number;
        error?: unknown;
    }>;
    getPatients: () => Promise<{ success: boolean; error?: unknown }>;
    getSinglePatient: (
        id: string
    ) => Promise<{ success: boolean; patient?: TypePatient; error?: unknown }>;
    updatePatient: (
        data: TypeUpdatePatient,
        id: string
    ) => Promise<{ success: boolean; status?: number; error?: unknown }>;
    deletePatient: (
        id: string
    ) => Promise<{ success: boolean; error?: unknown }>;
    createClinicalRecord: (
        id: string,
        data: TypeCreateRecord
    ) => Promise<{ success: boolean; error?: unknown }>;
    getClinicalRecords: (
        id: string
    ) => Promise<{ success: boolean; error?: unknown }>;
    getSingleClinicalRecord: (
        id: string,
        recordId: string
    ) => Promise<{ success: boolean; record?: ClinicalData; error?: unknown }>;
    deleteClinicalRecord: (
        id: string,
        recordId: string
    ) => Promise<{ success: boolean; error?: unknown }>;
    createAppointment: (data: TypeCreateAppointment) => Promise<{
        success: boolean;
        appointmentId?: string;
        status?: number;
        error?: unknown;
    }>;
    getAppointments: () => Promise<{ success: boolean; error?: unknown }>;
    getSingleAppointment: (appointmentId: string) => Promise<{
        success: boolean;
        session?: TypeSession;
        error?: unknown;
    }>;
    repeatAppointment: (
        data: TypeAppointmentRepeat,
        appointmentId: string
    ) => Promise<{
        success: boolean;
        appointmentIds?: string[];
        error?: unknown;
    }>;
    updateAppointment: (
        data: TypeAppointmentUpdate,
        appointmentId: string
    ) => Promise<{ success: boolean; status?: number; error?: unknown }>;
    deleteAppointment: (
        appointmentId: string
    ) => Promise<{ success: boolean; status?: number; error?: unknown }>;
}
