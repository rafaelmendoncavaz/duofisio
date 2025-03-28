import { create } from "zustand"
import type {
    TypeSearchFilter,
    TypeLoginData,
    TypeModal,
    TypeAPI,
    TypeCreatePatient,
    TypeUpdatePatient,
    TypeCreateRecord,
    TypeCreateAppointment,
    TypeAppointmentUpdate,
    TypeAppointmentRepeat,
} from "../types/types"
import { api } from "../api/api"

export const useModal = create<TypeModal>(set => ({
    isCreatePatientModalOpen: false,
    isSinglePatientModalOpen: false,
    isCreateAppointmentModalOpen: false,
    isSingleAppointmentModalOpen: false,
    openCreatePatientModal: () => set({ isCreatePatientModalOpen: true }),
    openSinglePatientModal: () => set({ isSinglePatientModalOpen: true }),
    openSingleAppointmentModal: () =>
        set({ isSingleAppointmentModalOpen: true }),
    closeModal: () =>
        set({
            isCreatePatientModalOpen: false,
            isSinglePatientModalOpen: false,
            isSingleAppointmentModalOpen: false,
        }),
}))

export const useSearchFilter = create<TypeSearchFilter>(set => ({
    searchName: "",
    searchPhone: "",
    searchCPF: "",
    setSearchName: (name: string) => set({ searchName: name }),
    setSearchPhone: (phone: string) => set({ searchPhone: phone }),
    setSearchCPF: (cpf: string) => set({ searchCPF: cpf }),
}))

export const useAPI = create<TypeAPI>((set, get) => ({
    // Estados
    token: localStorage.getItem("@authToken") || null,
    user: null,
    employees: null,
    activeFilter: null,

    // Armazenamento de requisições
    patientList: [],
    patientData: null,
    clinicalRecords: null,
    clinicalRecord: null,
    appointmentList: null,
    appointmentData: null,
    error: null,

    // Funções de limpeza
    clearRecords: () => set({ clinicalRecords: null }),
    clearRecord: () => set({ clinicalRecord: null }),
    clearAppointment: () => set({ appointmentData: null }),
    clearError: () => set({ error: null }),
    clearToken: () => set({ token: null }),

    // Funções assíncronas
    userLogin: async (loginData: TypeLoginData) => {
        try {
            const { data } = await api.post("/auth/login", loginData)
            const token = data.token
            localStorage.setItem("@authToken", token)
            set({ token, error: null })
            await get().verifyAuth() // Verifica usuário após login
            return { success: true }
        } catch (error) {
            set({ error: "Erro ao realizar login" })
            return { success: false, error }
        }
    },

    verifyAuth: async () => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            const { data } = await api.get("/auth/verify", {
                headers: { Authorization: `Bearer ${token}` },
            })
            set({
                token,
                user: data.user,
                employees: data.employees,
                error: null,
            })
            return { success: true, user: data.user }
        } catch (error) {
            set({
                token: null,
                user: null,
                error: "Erro ao verificar autenticação",
            })
            return { success: false, error }
        }
    },

    createPatient: async (data: TypeCreatePatient) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            const { data: response, status } = await api.post(
                "/dashboard/patients",
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            set({ error: null })
            return { success: true, patientId: response.patientId, status }
        } catch (error) {
            set({ error: "Erro ao criar paciente" })
            return { success: false, error }
        }
    },

    getPatients: async () => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            const { data } = await api.get("/dashboard/patients", {
                headers: { Authorization: `Bearer ${token}` },
            })
            set({ patientList: data.patients, error: null })
            return { success: true }
        } catch (error) {
            set({ error: "Erro ao buscar pacientes" })
            return { success: false, error }
        }
    },

    getSinglePatient: async (id: string) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            set({ patientData: null })
            const { data } = await api.get(`/dashboard/patients/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            set({ patientData: data.patient, error: null })
            return { success: true, patient: data.patient }
        } catch (error) {
            set({ error: "Erro ao buscar paciente" })
            return { success: false, error }
        }
    },

    updatePatient: async (data: TypeUpdatePatient, id: string) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            const { status } = await api.put(
                `/dashboard/patients/${id}`,
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            set({ error: null })
            return { success: true, status }
        } catch (error) {
            set({ error: "Erro ao editar paciente" })
            return { success: false, error }
        }
    },

    deletePatient: async (id: string) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            await api.delete(`/dashboard/patients/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            set({ error: null })
            return { success: true }
        } catch (error) {
            set({ error: "Erro ao deletar paciente" })
            return { success: false, error }
        }
    },

    createClinicalRecord: async (id: string, data: TypeCreateRecord) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            await api.post(`/dashboard/patients/${id}/clinical`, data, {
                headers: { Authorization: `Bearer ${token}` },
            })
            set({ error: null })
            return { success: true }
        } catch (error) {
            set({ error: "Erro ao criar registro clínico" })
            return { success: false, error }
        }
    },

    getClinicalRecords: async (id: string) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            set({ clinicalRecords: null })
            const { data } = await api.get(
                `/dashboard/patients/${id}/clinical`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            set({ clinicalRecords: data.patientClinicalRecord, error: null })
            return { success: true }
        } catch (error) {
            set({ error: "Erro ao buscar registros clínicos" })
            return { success: false, error }
        }
    },

    getSingleClinicalRecord: async (id: string, recordId: string) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            set({ clinicalRecord: null })
            const { data } = await api.get(
                `/dashboard/patients/${id}/clinical/${recordId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            set({ clinicalRecord: data.clinicalRecord, error: null })
            return { success: true, record: data.clinicalRecord }
        } catch (error) {
            set({ error: "Erro ao buscar registro clínico" })
            return { success: false, error }
        }
    },

    deleteClinicalRecord: async (id: string, recordId: string) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            await api.delete(`/dashboard/patients/${id}/clinical/${recordId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            set({ error: null })
            return { success: true }
        } catch (error) {
            set({ error: "Erro ao deletar registro clínico" })
            return { success: false, error }
        }
    },
    createAppointment: async (data: TypeCreateAppointment) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            const { data: response, status } = await api.post(
                "/dashboard/appointments",
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            set({ error: null })
            return {
                success: true,
                appointmentId: response.appointmentId,
                status,
            }
        } catch (error) {
            set({ error: "Erro ao criar agendamento" })
            return { success: false, error }
        }
    },
    getAppointments: async (filterParams = {}) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            const { data } = await api.get("/dashboard/appointments", {
                headers: { Authorization: `Bearer ${token}` },
                params: filterParams,
            })
            set({ appointmentList: data.appointments, error: null })
            return { success: true }
        } catch (error) {
            set({ error: "Erro ao buscar agendamentos" })
            return { success: false, error }
        }
    },
    setActiveFilter: filter => set({ activeFilter: filter }),
    getSingleAppointment: async (appointmentId: string) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            set({ appointmentData: null })
            const { data } = await api.get(
                `/dashboard/appointments/${appointmentId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            set({ appointmentData: data.session, error: null })
            return { success: true, appointment: data.session }
        } catch (error) {
            set({ error: "Erro ao buscar agendamento" })
            return { success: false, error }
        }
    },
    repeatAppointment: async (
        data: TypeAppointmentRepeat,
        appointmentId: string
    ) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            const { data: response } = await api.post(
                `/dashboard/appointments/${appointmentId}/repeat`,
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            set({ error: null })
            return { success: true, appointmentIds: response.sessionIds }
        } catch (error) {
            set({ error: "Erro ao repetir agendamento" })
            return { success: false, error }
        }
    },
    updateAppointment: async (
        data: TypeAppointmentUpdate,
        appointmentId: string
    ) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            const { status } = await api.put(
                `/dashboard/appointments/${appointmentId}`,
                data,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            set({ error: null })
            return { success: true, status }
        } catch (error) {
            set({ error: "Erro ao editar agendamento" })
            return { success: false, error }
        }
    },
    deleteAppointment: async (appointmentId: string) => {
        try {
            const token = localStorage.getItem("@authToken")
            if (!token) throw new Error("Token não encontrado")
            await api.delete(`/dashboard/appointments/${appointmentId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            set({ error: null })
            return { success: true }
        } catch (error) {
            set({ error: "Erro ao deletar agendamento" })
            return { success: false, error }
        }
    },
}))
